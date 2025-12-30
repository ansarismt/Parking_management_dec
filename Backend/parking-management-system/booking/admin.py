from django.contrib import admin
from booking.models import Pass
from parking.slot_services import reallocate_slot


@admin.register(Pass)
class PassAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user_name",
        "user_role",
        "pass_type",
        "slot_code",
        "status",
        "arrived",
        "extension_requested",
        "start_date",
        "end_date",
    )

    list_filter = (
        "user_role",
        "pass_type",
        "status",
        "extension_requested",
    )

    search_fields = (
        "user_name",
        "email",
        "mobile",
        "slot_code",
    )

    actions = ["approve_extension", "reject_extension"]

    # ===============================
    # ADMIN ACTIONS
    # ===============================

    def approve_extension(self, request, queryset):
        for booking in queryset:
            if booking.status != "PENDING_EXTENSION":
                continue

            # Try reallocation if needed
            new_slot = reallocate_slot(booking.slot_code)
            if new_slot:
                booking.slot_code = new_slot.slot_code

            booking.status = "EXTENDED"
            booking.extension_requested = False
            booking.save()

        self.message_user(request, "Selected extensions approved.")

    approve_extension.short_description = "Approve extension requests"

    def reject_extension(self, request, queryset):
        queryset.update(
            status="ACTIVE",
            extension_requested=False
        )
        self.message_user(request, "Selected extensions rejected.")

    reject_extension.short_description = "Reject extension requests"
