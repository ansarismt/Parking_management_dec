from django.db import models


class Pass(models.Model):
    PASS_TYPE_CHOICES = [
        ('DAILY', 'Daily'),
        ('MONTHLY', 'Monthly'),
        ('YEARLY', 'Yearly'),
    ]

    USER_ROLE_CHOICES = [
        ('EMPLOYEE', 'Employee'),
        ('VISITOR', 'Visitor'),
        ('GUEST', 'Guest/VIP'),
    ]

    PASS_STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('PENDING_EXTENSION', 'Pending Extension'),
        ('EXTENDED', 'Extended'),
        ('CANCELLED', 'Cancelled'),
        ('NO_SHOW', 'No Show'),
        ('EXPIRED', 'Expired'),
    ]

    # Who
    user_role = models.CharField(max_length=10, choices=USER_ROLE_CHOICES)
    user_name = models.CharField(max_length=100)
    email = models.EmailField()
    mobile = models.CharField(max_length=15)

    # Pass details
    pass_type = models.CharField(max_length=10, choices=PASS_TYPE_CHOICES)
    slot_code = models.CharField(max_length=10)

    # Time
    start_date = models.DateField()
    end_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    # Lifecycle
    status = models.CharField(
        max_length=20,
        choices=PASS_STATUS_CHOICES,
        default='ACTIVE'
    )

    arrived = models.BooleanField(default=False)
    extension_requested = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_name} - {self.slot_code} ({self.status})"
