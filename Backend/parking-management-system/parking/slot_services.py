from parking.models import ParkingSlot
from django.db import transaction


# ===============================
# GET NEXT AVAILABLE SLOT
# ===============================
def get_available_slot(slot_type, slot_role, slot_group=None):
    """
    Returns the first AVAILABLE slot
    """
    query = ParkingSlot.objects.filter(
        slot_type=slot_type,
        slot_role=slot_role,
        status="AVAILABLE"
    )

    if slot_group:
        query = query.filter(slot_group=slot_group)

    return query.first()


# ===============================
# RESERVE SLOT
# ===============================
@transaction.atomic
def reserve_slot(slot_code):
    """
    Marks a slot as RESERVED
    """
    try:
        slot = ParkingSlot.objects.select_for_update().get(
            slot_code=slot_code,
            status="AVAILABLE"
        )
        slot.status = "RESERVED"
        slot.save()
        return slot
    except ParkingSlot.DoesNotExist:
        return None


# ===============================
# FREE SLOT
# ===============================
@transaction.atomic
def free_slot(slot_code):
    """
    Frees an occupied or reserved slot
    """
    try:
        slot = ParkingSlot.objects.select_for_update().get(
            slot_code=slot_code
        )
        slot.status = "AVAILABLE"
        slot.save()
        return slot
    except ParkingSlot.DoesNotExist:
        return None


# ===============================
# REALLOCATE SLOT
# ===============================
@transaction.atomic
def reallocate_slot(slot_code):
    """
    Finds a new slot if current one must be freed
    """
    try:
        current = ParkingSlot.objects.select_for_update().get(
            slot_code=slot_code
        )

        new_slot = get_available_slot(
            slot_type=current.slot_type,
            slot_role=current.slot_role,
            slot_group=current.slot_group
        )

        if new_slot:
            current.status = "FREED"
            current.save()

            new_slot.status = "RESERVED"
            new_slot.save()

            return new_slot

        return None

    except ParkingSlot.DoesNotExist:
        return None
