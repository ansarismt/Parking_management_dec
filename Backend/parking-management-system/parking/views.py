from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from parking.slot_services import (
    reserve_slot,
    free_slot,
    reallocate_slot,
)
from parking.models import ParkingSlot

@csrf_exempt
def reserve_slot_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        slot_code = data.get("slot_code")

        slot = reserve_slot(slot_code)
        if slot:
            return JsonResponse({
                "status": "success",
                "slot_code": slot.slot_code,
                "slot_status": slot.status
            })

        return JsonResponse(
            {"status": "failed", "message": "Slot not available"},
            status=400
        )

    # 👇 ADD THIS
    return JsonResponse(
        {"message": "Use POST method to reserve a slot"},
        status=405
    )


@csrf_exempt
def free_slot_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        slot_code = data.get("slot_code")

        slot = free_slot(slot_code)
        if slot:
            return JsonResponse({
                "status": "success",
                "slot_code": slot.slot_code,
                "slot_status": slot.status
            })

        return JsonResponse(
            {"status": "failed", "message": "Slot not found"},
            status=404
        )

    return JsonResponse(
        {"message": "Use POST method to free a slot"},
        status=405
    )


@csrf_exempt
def reallocate_slot_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        slot_code = data.get("slot_code")

        new_slot = reallocate_slot(slot_code)
        if new_slot:
            return JsonResponse({
                "status": "success",
                "new_slot": new_slot.slot_code
            })

        return JsonResponse(
            {"status": "failed", "message": "No alternate slot available"},
            status=400
        )

    return JsonResponse(
        {"message": "Use POST method to reallocate slot"},
        status=405
    )
