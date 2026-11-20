"""Build docs/_static/caretta-viewer/caretta.glb from the Caretta URDF and STL meshes.

The 3D viewer on the Robots page loads this file. Run it again when the robot model changes:

    xacro <caretta_description>/urdf/caretta.urdf.xacro > /tmp/caretta.urdf
    python3 tools/make_caretta_glb.py /tmp/caretta.urdf <caretta_description>/urdf/meshes \
        docs/_static/caretta-viewer/caretta.glb

Needs only numpy. Each part becomes one glTF node with extras the viewer uses:
  layer: 0 bottom plate, 1 middle plate, 2 top plate (moved apart by "Explode")
  group: what the buttons show and hide (plate_top, plate_middle, electronics, ...)
"""
import json
import os
import struct
import sys
import xml.etree.ElementTree as ET

import numpy as np


def load_stl(path):
    data = open(path, "rb").read()
    n = struct.unpack("<I", data[80:84])[0]
    rec = np.dtype([("n", "<3f4"), ("v", "<9f4"), ("a", "<u2")])
    return np.frombuffer(data[84:84 + 50 * n], dtype=rec)["v"].reshape(-1, 3, 3).astype(np.float64)


def components(tris):
    """Label each triangle with its connected component (triangles sharing a vertex)."""
    verts = np.round(tris.reshape(-1, 3), 6)
    _, inv = np.unique(verts, axis=0, return_inverse=True)
    inv = inv.reshape(-1, 3)
    parent = np.arange(inv.max() + 1)

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    for a, b, c in inv:
        ra = find(a)
        parent[find(b)] = ra
        parent[find(c)] = ra
    return np.array([find(t[0]) for t in inv])


def split_by_height(tris, bands):
    """Split a mesh into parts by the lowest z of each connected component.
    bands: list of (name, z_min, z_max); returns {name: triangles}."""
    labels = components(tris)
    out = {name: [] for name, _, _ in bands}
    for label in np.unique(labels):
        part = tris[labels == label]
        z = part[:, :, 2].min()
        for name, lo, hi in bands:
            if lo <= z < hi:
                out[name].append(part)
                break
        else:
            raise SystemExit(f"component at z={z:.4f} fits no band")
    return {k: np.concatenate(v) for k, v in out.items() if v}


def srgb_to_linear(c):
    c = np.asarray(c, dtype=float)
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def link_positions(robot):
    parent, offset = {}, {}
    for joint in robot.findall("joint"):
        child = joint.find("child").get("link")
        parent[child] = joint.find("parent").get("link")
        origin = joint.find("origin")
        offset[child] = np.array([float(v) for v in origin.get("xyz").split()])
        rpy = [float(v) for v in origin.get("rpy", "0 0 0").split()]
        offset[child + "#rot"] = any(abs(a) > 1e-9 for a in rpy)

    def position(link):
        p = np.zeros(3)
        while link in parent:
            if offset[link + "#rot"]:
                raise SystemExit(f"{link}: rotated joints are not supported")
            p += offset[link]
            link = parent[link]
        return p

    return position


# Where each URDF visual goes: link -> (part name, layer, group). Body meshes are split by height.
PARTS = {
    "caretta_motor_1": ("motor_right", 0, "drive"),
    "caretta_motor_2": ("motor_left", 0, "drive"),
    "caretta_wheel_right": ("wheel_right", 0, "drive"),
    "caretta_wheel_left": ("wheel_left", 0, "drive"),
    "caretta_tire_right": ("tire_right", 0, "drive"),
    "caretta_tire_left": ("tire_left", 0, "drive"),
    "caretta_ball_caster": ("caster", 0, "drive"),
    "caretta_lidar": ("lidar", 2, "electronics"),
    "caretta_camera": ("camera", 2, "electronics"),
    "caretta_estop_housing": ("estop_housing", 2, "electronics"),
    "caretta_estop_button": ("estop_button", 2, "electronics"),
}
# Plates: P01 z 20-25 mm, P02 65-71 mm, P03 111-117 mm (+ camera pod hanging from it)
SPLITS = {
    "caretta_base_link": [("plate_bottom", 0.0, 0.04, 0, "plate_bottom"),
                          ("plate_middle", 0.04, 0.08, 1, "plate_middle"),
                          ("plate_top", 0.08, 1.0, 2, "plate_top")],
    "caretta_teal_inlays": [("stripes_bottom", 0.0, 0.04, 0, "plate_bottom"),
                            ("stripes_middle", 0.04, 0.08, 1, "plate_middle"),
                            ("stripes_top", 0.08, 1.0, 2, "plate_top")],
    "caretta_amber_inlays": [("lamp_bottom", 0.0, 0.04, 0, "plate_bottom"),
                             ("lamp_top", 0.08, 1.0, 2, "plate_top")],
    # lower standoffs stand on P01, upper ones on P02
    "caretta_standoffs": [("standoffs_lower", 0.0, 0.05, 0, "standoffs"),
                          ("standoffs_upper", 0.05, 1.0, 1, "standoffs")],
}
METAL = {"caretta_standoffs": (0.6, 0.35), "caretta_ball_caster": (0.7, 0.3)}


def ros_to_gltf(p):
    """ROS (x forward, y left, z up) -> glTF (y up): (x, z, -y)."""
    return np.stack([p[..., 0], p[..., 2], -p[..., 1]], axis=-1)


def main(urdf_path, mesh_dir, out_path):
    robot = ET.parse(urdf_path).getroot()
    position = link_positions(robot)

    entries = []  # (name, layer, group, triangles in ROS base frame, color, metal, rough, mesh key)
    for link in robot.findall("link"):
        name = link.get("name")
        for visual in link.findall("visual"):
            mesh = visual.find("geometry/mesh")
            if mesh is None:
                continue
            fname = os.path.basename(mesh.get("filename"))
            tris = load_stl(os.path.join(mesh_dir, fname))
            color = [float(v) for v in visual.find("material/color").get("rgba").split()[:3]]
            metal, rough = METAL.get(name, (0.0, 0.65))
            at = position(name)
            if name in SPLITS:
                bands = SPLITS[name]
                parts = split_by_height(tris, [(b[0], b[1], b[2]) for b in bands])
                for part, lo, hi, layer, group in bands:
                    entries.append((part, layer, group, parts[part], at, color, metal, rough, part))
            elif name in PARTS:
                part, layer, group = PARTS[name]
                entries.append((part, layer, group, tris, at, color, metal, rough, fname))
            else:
                raise SystemExit(f"no viewer part for link {name}")

    blob = bytearray()
    views, accessors, meshes, materials, nodes = [], [], [], [], []
    mesh_index, mat_index = {}, {}

    def add_view(data, target):
        while len(blob) % 4:
            blob.append(0)
        views.append({"buffer": 0, "byteOffset": len(blob), "byteLength": len(data), "target": target})
        blob.extend(data)
        return len(views) - 1

    for part, layer, group, tris, at, color, metal, rough, key in entries:
        mkey = (key, tuple(color))
        if mkey not in mat_index:
            mat_index[mkey] = len(materials)
            materials.append({
                "name": part,
                "pbrMetallicRoughness": {"baseColorFactor": [*srgb_to_linear(color).round(5).tolist(), 1.0],
                                         "metallicFactor": metal, "roughnessFactor": rough},
            })
        if key not in mesh_index:
            # Indexed geometry, positions only: the viewer computes creased normals.
            verts, inv = np.unique(np.round(ros_to_gltf(tris.reshape(-1, 3)), 6), axis=0, return_inverse=True)
            verts = verts.astype(np.float32)
            idx = inv.astype(np.uint16 if len(verts) < 65536 else np.uint32)
            pv = add_view(verts.tobytes(), 34962)
            accessors.append({"bufferView": pv, "componentType": 5126, "count": len(verts), "type": "VEC3",
                              "min": verts.min(0).tolist(), "max": verts.max(0).tolist()})
            iv = add_view(idx.tobytes(), 34963)
            accessors.append({"bufferView": iv, "componentType": 5123 if idx.dtype == np.uint16 else 5125,
                              "count": len(idx), "type": "SCALAR"})
            mesh_index[key] = len(meshes)
            meshes.append({"name": key, "primitives": [{"attributes": {"POSITION": len(accessors) - 2},
                                                         "indices": len(accessors) - 1,
                                                         "material": mat_index[mkey]}]})
        nodes.append({"name": part, "mesh": mesh_index[key],
                      "translation": ros_to_gltf(np.asarray(at)).round(6).tolist(),
                      "extras": {"layer": layer, "group": group}})

    gltf = {
        "asset": {"version": "2.0", "generator": "make_caretta_glb.py"},
        "scene": 0,
        "scenes": [{"name": "caretta", "nodes": list(range(len(nodes)))}],
        "nodes": nodes, "meshes": meshes, "materials": materials,
        "accessors": accessors, "bufferViews": views, "buffers": [{"byteLength": len(blob)}],
    }
    js = json.dumps(gltf, separators=(",", ":")).encode()
    js += b" " * (-len(js) % 4)
    while len(blob) % 4:
        blob.append(0)
    total = 12 + 8 + len(js) + 8 + len(blob)
    with open(out_path, "wb") as f:
        f.write(struct.pack("<III", 0x46546C67, 2, total))
        f.write(struct.pack("<II", len(js), 0x4E4F534A) + js)
        f.write(struct.pack("<II", len(blob), 0x004E4942) + bytes(blob))
    tri_count = sum(len(e[3]) for e in entries)
    print(f"{out_path}: {len(nodes)} parts, {tri_count} triangles, {total / 1e6:.2f} MB")


if __name__ == "__main__":
    if len(sys.argv) != 4:
        sys.exit(__doc__)
    main(*sys.argv[1:])
