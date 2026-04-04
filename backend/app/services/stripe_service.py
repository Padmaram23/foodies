"""
Stripe external service wrapper.
All Stripe API interactions must go through this module.
"""
import os
import requests
from requests.auth import HTTPBasicAuth

STRIPE_API = 'https://api.stripe.com/v1'


def _auth():
    return HTTPBasicAuth(os.getenv('STRIPE_SECRET_KEY', ''), '')


def create_checkout_session(line_items: list, order_id: str, success_url: str, cancel_url: str) -> dict:
    """
    Create a Stripe Checkout Session.
    line_items: [{ 'name': str, 'amount': int (paise), 'quantity': int }]
    Returns the session dict including the hosted checkout URL.
    """
    data = {
        'mode': 'payment',
        'success_url': success_url,
        'cancel_url': cancel_url,
        'metadata[order_id]': order_id,
    }

    for i, item in enumerate(line_items):
        data[f'line_items[{i}][price_data][currency]'] = 'inr'
        data[f'line_items[{i}][price_data][unit_amount]'] = item['amount']
        data[f'line_items[{i}][price_data][product_data][name]'] = item['name']
        data[f'line_items[{i}][quantity]'] = item['quantity']

    resp = requests.post(f'{STRIPE_API}/checkout/sessions', data=data, auth=_auth(), timeout=10)
    resp.raise_for_status()
    return resp.json()


def get_checkout_session(session_id: str) -> dict:
    """Retrieve a Checkout Session to verify payment status."""
    resp = requests.get(
        f'{STRIPE_API}/checkout/sessions/{session_id}',
        auth=_auth(),
        timeout=10
    )
    resp.raise_for_status()
    return resp.json()
