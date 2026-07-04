from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from models import Item, db

items_bp = Blueprint("items", __name__, url_prefix="/api/items")


@items_bp.get("")
@jwt_required()
def list_items():
    user_id = int(get_jwt_identity())
    items = Item.query.filter_by(user_id=user_id).order_by(Item.created_at.desc()).all()
    return jsonify([item.to_dict() for item in items])


@items_bp.post("")
@jwt_required()
def create_item():
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()

    if not name:
        return jsonify({"error": "name is required"}), 400

    item = Item(
        user_id=user_id,
        name=name,
        category=data.get("category"),
        quantity=data.get("quantity", 1),
        notes=data.get("notes"),
    )
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201


@items_bp.put("/<int:item_id>")
@jwt_required()
def update_item(item_id):
    user_id = int(get_jwt_identity())
    item = Item.query.filter_by(id=item_id, user_id=user_id).first()
    if not item:
        return jsonify({"error": "item not found"}), 404

    data = request.get_json(silent=True) or {}
    item.name = (data.get("name") or item.name).strip()
    item.category = data.get("category", item.category)
    item.quantity = data.get("quantity", item.quantity)
    item.notes = data.get("notes", item.notes)
    db.session.commit()
    return jsonify(item.to_dict())


@items_bp.delete("/<int:item_id>")
@jwt_required()
def delete_item(item_id):
    user_id = int(get_jwt_identity())
    item = Item.query.filter_by(id=item_id, user_id=user_id).first()
    if not item:
        return jsonify({"error": "item not found"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "item deleted"})
