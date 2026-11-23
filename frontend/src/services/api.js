const API_URL = "https://luxecart-ogf3.onrender.com/api";

// ================================
// PRODUCTS
// ================================

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function createProduct(product) {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Failed to create product");
  }

  return response.json();
}

export async function updateProduct(id, product) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      ...product,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update product");
  }

  return response.json();
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }

  return response.json();
}


// ================================
// ORDERS
// ================================

export async function getOrders() {
  const response = await fetch(`${API_URL}/orders`);

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  return response.json();
}

export async function getOrder(id) {
  const response = await fetch(`${API_URL}/orders/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch order");
  }

  return response.json();
}

export async function getCustomerOrders(userId) {
  const response = await fetch(
    `${API_URL}/orders/customer/${userId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch customer orders");
  }

  return response.json();
}

export async function createOrder(order) {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    throw new Error("Failed to create order");
  }

  return response.json();
}

export async function updateOrder(id, order) {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      ...order,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update order");
  }

  return response.json();
}


// ================================
// DELIVERY STATUS
// ================================

export async function updateDeliveryStatus(id, status) {
  const response = await fetch(
    `${API_URL}/orders/${id}/delivery`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update delivery status");
  }

  return response.json();
}


// ================================
// PAYMENT STATUS
// ================================

export async function updatePaymentStatus(id, status) {
  const response = await fetch(
    `${API_URL}/orders/${id}/payment`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update payment status");
  }

  return response.json();
}


// ================================
// DELETE ORDER
// ================================

export async function deleteOrder(id) {
  const response = await fetch(
    `${API_URL}/orders/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete order");
  }

  return response.json();
}


// ================================
// USERS
// ================================

export async function getUsers() {
  const response = await fetch(`${API_URL}/users`);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}


// ================================
// UPDATE USER
// ================================

export async function updateUser(id, user) {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Failed to update customer");
  }

  return response.json();
}
// ================================
// CUSTOMER MESSAGES
// ================================

export async function getMessages() {
  const response = await fetch(
    `${API_URL}/customer-messages`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch customer messages"
    );
  }

  return response.json();
}

export async function getCustomerMessages(userId) {
  const response = await fetch(
    `${API_URL}/customer-messages/customer/${userId}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch customer messages"
    );
  }

  return response.json();
}

export async function createMessage(message) {
  const response = await fetch(
    `${API_URL}/customer-messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to send customer message"
    );
  }

  return response.json();
}

export async function replyToMessage(id, reply) {
  const response = await fetch(
    `${API_URL}/customer-messages/${id}/reply`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reply,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to reply to customer message"
    );
  }

  return response.json();
}

export async function deleteMessage(id) {
  const response = await fetch(
    `${API_URL}/customer-messages/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to delete customer message"
    );
  }

  return response.json();
}
export async function initializePayment(payment) {
  const response = await fetch(
    `${API_URL}/paystack/initialize`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payment),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to initialize Paystack payment."
    );
  }

  return data;
}

export async function verifyPayment(reference) {
  const response = await fetch(
    `${API_URL}/paystack/verify/${encodeURIComponent(reference)}`
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to verify payment."
    );
  }

  return data;
}
// ================================
// TESTIMONIALS
// ================================

export async function getTestimonials() {
  const response = await fetch(
    `${API_URL}/testimonials`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch testimonials"
    );
  }

  return response.json();
}

export async function getApprovedTestimonials() {
  const response = await fetch(
    `${API_URL}/testimonials/approved`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch approved testimonials"
    );
  }

  return response.json();
}

export async function getCustomerTestimonials(
  userId
) {
  const response = await fetch(
    `${API_URL}/testimonials/customer/${userId}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch customer testimonials"
    );
  }

  return response.json();
}

export async function createTestimonial(
  testimonial
) {
  const response = await fetch(
    `${API_URL}/testimonials`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testimonial),
    }
  );

  const data =
    await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to submit testimonial"
    );
  }

  return data;
}

export async function approveTestimonial(id) {
  const response = await fetch(
    `${API_URL}/testimonials/${id}/approve`,
    {
      method: "PUT",
    }
  );

  const data =
    await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to approve testimonial"
    );
  }

  return data;
}

export async function rejectTestimonial(id) {
  const response = await fetch(
    `${API_URL}/testimonials/${id}/reject`,
    {
      method: "PUT",
    }
  );

  const data =
    await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to reject testimonial"
    );
  }

  return data;
}

export async function deleteTestimonial(id) {
  const response = await fetch(
    `${API_URL}/testimonials/${id}`,
    {
      method: "DELETE",
    }
  );

  const data =
    await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to delete testimonial"
    );
  }

  return data;
}