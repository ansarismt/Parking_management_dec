from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from booking.models import Pass
from parking.slot_services import reserve_slot, free_slot


@csrf_exempt
def create_pass(request):
    """
    Create a new pass and reserve slot
    """
    if request.method == "POST":
        data = json.loads(request.body)

        slot_code = data.get("slot_code")

        # Reserve slot using Person-2 API
        slot = reserve_slot(slot_code)
        if not slot:
            return JsonResponse(
                {"status": "failed", "message": "Slot not available"},
                status=400
            )

        booking = Pass.objects.create(
            user_role=data["user_role"],
            user_name=data["user_name"],
            email=data["email"],
            mobile=data["mobile"],
            pass_type=data["pass_type"],
            slot_code=slot_code,
            start_date=data["start_date"],
            end_date=data["end_date"],
            start_time=data["start_time"],
            end_time=data["end_time"],
            status="ACTIVE"
        )

        return JsonResponse({
            "status": "success",
            "pass_id": booking.id,
            "slot_code": booking.slot_code
        })

    return JsonResponse(
        {"message": "Use POST method"},
        status=405
    )


@csrf_exempt
def cancel_pass(request):
    """
    Cancel a pass and free slot
    """
    if request.method == "POST":
        data = json.loads(request.body)
        pass_id = data.get("pass_id")

        try:
            booking = Pass.objects.get(id=pass_id, status="ACTIVE")
        except Pass.DoesNotExist:
            return JsonResponse(
                {"status": "failed", "message": "Active pass not found"},
                status=404
            )

        booking.status = "CANCELLED"
        booking.save()

        # Free slot using Person-2 API
        free_slot(booking.slot_code)

        return JsonResponse({
            "status": "success",
            "message": "Pass cancelled"
        })

    return JsonResponse(
        {"message": "Use POST method"},
        status=405
    )


@csrf_exempt
def request_extension(request):
    """
    Request time extension (admin approval later)
    """
    if request.method == "POST":
        data = json.loads(request.body)
        pass_id = data.get("pass_id")

        try:
            booking = Pass.objects.get(id=pass_id, status="ACTIVE")
        except Pass.DoesNotExist:
            return JsonResponse(
                {"status": "failed", "message": "Active pass not found"},
                status=404
            )

        booking.status = "PENDING_EXTENSION"
        booking.extension_requested = True
        booking.save()

        return JsonResponse({
            "status": "success",
            "message": "Extension request submitted"
        })

    return JsonResponse(
        {"message": "Use POST method"},
        status=405
    )

@csrf_exempt
def mark_arrived(request):
    """
    Mark that the user has arrived (prevents no-show)
    """
    if request.method == "POST":
        data = json.loads(request.body)
        pass_id = data.get("pass_id")

        try:
            booking = Pass.objects.get(id=pass_id)
        except Pass.DoesNotExist:
            return JsonResponse(
                {"status": "failed", "message": "Pass not found"},
                status=404
            )

        booking.arrived = True
        booking.save()

        return JsonResponse({
            "status": "success",
            "message": "Arrival marked successfully"
        })

    return JsonResponse(
        {"message": "Use POST method"},
        status=405
    )


def get_pass_status(request, pass_id):
    """
    Get current pass status (for dashboard, timers, admin)
    """
    try:
        booking = Pass.objects.get(id=pass_id)
    except Pass.DoesNotExist:
        return JsonResponse(
            {"status": "failed", "message": "Pass not found"},
            status=404
        )

    return JsonResponse({
        "pass_id": booking.id,
        "user_name": booking.user_name,
        "user_role": booking.user_role,
        "slot_code": booking.slot_code,
        "status": booking.status,
        "arrived": booking.arrived,
        "start_date": booking.start_date,
        "end_date": booking.end_date,
        "start_time": booking.start_time,
        "end_time": booking.end_time,
    })
