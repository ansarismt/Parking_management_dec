from django.urls import path
from booking import views

urlpatterns = [
    path("create-pass/", views.create_pass, name="create_pass"),
    path("cancel-pass/", views.cancel_pass, name="cancel_pass"),
    path("request-extension/", views.request_extension, name="request_extension"),
     path("mark-arrived/", views.mark_arrived, name="mark_arrived"),
    path("pass-status/<int:pass_id>/", views.get_pass_status, name="get_pass_status"),
]
