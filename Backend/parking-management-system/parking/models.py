from django.db import models


class ParkingSlot(models.Model):
    SLOT_TYPE_CHOICES = [
        ('CAR', 'Car'),
        ('BIKE', 'Bike'),
    ]

    SLOT_ROLE_CHOICES = [
        ('EMPLOYEE', 'Employee'),
        ('VISITOR', 'Visitor'),
        ('GUEST', 'Guest/VIP'),
    ]

    SLOT_STATUS_CHOICES = [
        ('AVAILABLE', 'Available'),
        ('RESERVED', 'Reserved'),
        ('OCCUPIED', 'Occupied'),
        ('FREED', 'Freed'),
        ('REALLOCATED', 'Reallocated'),
    ]

    slot_code = models.CharField(max_length=10, unique=True)
    slot_group = models.CharField(max_length=10, blank=True, null=True)
    slot_type = models.CharField(max_length=10, choices=SLOT_TYPE_CHOICES)
    slot_role = models.CharField(max_length=10, choices=SLOT_ROLE_CHOICES)

    status = models.CharField(
        max_length=15,
        choices=SLOT_STATUS_CHOICES,
        default='AVAILABLE'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.slot_code


class Vehicle(models.Model):
    VEHICLE_TYPE_CHOICES = [
        ('CAR', 'Car'),
        ('BIKE', 'Bike'),
    ]

    vehicle_number = models.CharField(max_length=20)
    vehicle_type = models.CharField(max_length=10, choices=VEHICLE_TYPE_CHOICES)

    def __str__(self):
        return self.vehicle_number
