from django.urls import path
from parking import views

urlpatterns = [
    path("reserve-slot/", views.reserve_slot_view, name="reserve_slot"),
    path("free-slot/", views.free_slot_view, name="free_slot"),
    path("reallocate-slot/", views.reallocate_slot_view, name="reallocate_slot"),
]
