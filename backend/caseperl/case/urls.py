from django.urls import path
from .views import (
    CaseListCreateView,
    UserCasesView,
    CaseUpdateView,
    CaseUpdateStatusView,
    CaseDeleteView
)

urlpatterns = [
    path('', CaseListCreateView.as_view(), name='case-list-create'),  # GET all / POST new
    path('user/<int:user_id>/', UserCasesView.as_view(), name='user-cases'),  # GET by user (changed)
    path('update/<int:id>/<int:user_id>/', CaseUpdateView.as_view(), name='case-update'),  # PUT update by user
    path('status/<int:id>/<int:idx_status>/', CaseUpdateStatusView.as_view(), name='case-update-status'),  # PUT update status
    path('delete/<int:id>/', CaseDeleteView.as_view(), name='case-delete'),  # DELETE by id (changed)
]