document.addEventListener("DOMContentLoaded", function () {
  const baseURL = "http://82.112.238.13:5005/dashboarddatabase"; // Update with your API base URL

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found in local storage");
    window.location.href = "login.html";
  }

  function fetchOrderDetail(orderId, status) {
    console.log(status);
    fetch(`${baseURL}/orders/${orderId}/request-detail?status=${status}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const orderDetails = data.result;
        displayOrderDetails(orderDetails);
        console.log(orderDetails);
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
      });
  }

  // Function to display order details in HTML
  function displayOrderDetails(result) {
    let renderTechnician = "";

    if (result.userType !== "technician") {
      renderTechnician = `
        <div class="row">
          <div class="col-md-6">
            <h4>Technician Information</h4>
            <p>
              <strong>Name:</strong>
              <span class="technician-name" id="technician_name">
                ${result.technician.name}
              </span>
            </p>
            <p>
              <strong>Estimated Time of Arrival:</strong>
              <span class="ETA" id="ETA">
                ${result.technician.eta}
              </span>
            </p>
            <p>
              <strong>Contact Number:</strong>
              <span class="technician-phone" id="technician_phone">
                ${result.technician.contactNumber}
              </span>
            </p>
          </div>
        </div>
      `;
    }
    let renderBtnGroup = "";
    console.log(result.accept);
    if (
      result.userType === "technician" &&
      result.orderStatus === "ongoing" &&
      result.accept === 0
    ) {
      renderBtnGroup = `
      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#acceptModal">
      Accept
    </button>
    
    <button class="btn btn-danger ms-2" data-bs-toggle="modal" data-bs-target="#declineModal">
      Decline
    </button>
          `;
    } else if (
      result.userType === "technician" &&
      result.orderStatus === "ongoing" &&
      result.accept === 1
    ) {
      renderBtnGroup = `
      <a href="mark_complete.html?id=${result.orderId}"><button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#acceptModal">
      Mark Completed
    </button></a>
    
    <button class="btn btn-danger ms-2" data-bs-toggle="modal" data-bs-target="#declineModal">
      Cancel
    </button>
         `;
    } else if (result.userType === "customer" && result.orderStatus === "completed") {
      renderBtnGroup = `
      <a href="customer_invoice.html?id=${result.orderId}"><button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#acceptModal">
      View Bill
    </button>
      </a>
      <a href="create_review.html?id=${result.orderId}"><button class="btn btn-primary ms-2" data-bs-toggle="modal" data-bs-target="#acceptModal">
      Review
    </button>
      </a>
         `;
    }
    const btnGroup = document.getElementById("btnGroup");
    btnGroup.innerHTML = renderBtnGroup;

    const requestDetail = document.getElementById("request_details");
    requestDetail.innerHTML = `
        <h2>Order Details</h2>
        <div class="row">
          <div class="col-md-6">
            <h4>Customer Information</h4>
            <p><strong>Name:</strong> <span class="customer-name" id="customer_name">${
              result.customer.name
            }</span></p>
            <p><strong>Address:</strong> <span class="customer-address" id="customer_address">${
              result.customer.address
            }</span></p>
          </div>
          <div class="col-md-6">
            <h4>Request Information</h4>
            <p><strong>Service No.:</strong> <span class="service_no" id="service_no">#000${
              result.orderId
            }</span></p>
            <p><strong>Problem:</strong> <span class="problem" id="problem">${
              result.problem
            }</span></p>
            <p><strong>Priority:</strong> <span class="priority" id="priority">${
              result.priority
            }</span></p>
            <p><strong>Completed on:</strong> <span class="datetime" id="datetime">${
              result.orderDoneDate || ""
            }</span></p>
            <p><strong>Status:</strong> <span class="status" id="status">${
              result.orderStatus
            }</span></p>
            <p> <span class="eventId" id="eventId">${
              result.eventId
            }</span></p>
          </div>
        </div>
        ${renderTechnician}
        <div class="row">
          <div class="col-md-12">
            <h4>Problem Details</h4>
            <p id="description">${result.orderDetail}</p>
            <img src="${result.orderImage}" alt="${
      result.problem
    }" id="problem_image">
          </div>
        </div>
        
      `;
  }

  function declineRequest(id, cancel_details) {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      window.location.href = "login.html";
    }
    fetch(`${baseURL}/orders/${id}/decline-request`, {
      method: "PUT",
      body: JSON.stringify({ cancel_details }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          window.location.href = "login.html";
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === 200) {
          window.location.href = "technician_dashboard.html";
        } else {
          console.error("Decline request failed:", data.message);
        }
      });
  }

  function acceptOrder(orderId, eta, total_amount) {
    fetch(`${baseURL}/orders/${orderId}/accept`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({ eta, total_amount }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          alert("Order accepted successfully");
          window.location.reload();
        } else {
          alert("Failed to accept order");
        }
      })
      .catch((error) => {
        console.error("Error accepting order:", error);
        alert("An error occurred while accepting the order");
      });
  }

  //modals for accept and decline
  const confirmAcceptBtn = document.getElementById("confirmOrder");
  confirmAcceptBtn.addEventListener("click", async () => {
    const eta = document.getElementById("eta").value;
    const total_amount = document.getElementById("amount").value;

    const summary = document.getElementById('summary').value;
    const description = document.getElementById('description').value;
    const arrivalTimeStart = document.getElementById('arrival-time-start').value;
    const arrivalTimeEnd = document.getElementById('arrival-time-end').value;

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("id");

    const data = {
        eta,
        summary,
        description,
        arrivalTimeStart,
        arrivalTimeEnd,
        orderId
    };

    try {
        const response = await fetch('/submit-eta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.text();
        alert(result);
    } catch (error) {
        console.error('Error:', error);
    }

    
    acceptOrder(orderId, eta, total_amount);
    console.log(eta, total_amount);
  });

  const confirmDeclineBtn = document.getElementById("confirmDecline");
  confirmDeclineBtn.addEventListener("click", async () => {
    const declineReason = document.getElementById("declineReason").value;
    if (declineReason.trim() === "") {
      document.getElementById("declineError").innerHTML =
        "Please enter a reason for declining the order.";
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("id");

    const eventId = document.getElementById("eventId").innerText;
    alert('Testing for Event ID: ', eventId);

    try {
      const response = await fetch('/delete-event', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ eventId })
      });

      const result = await response.text();
      alert(result);
    } catch (error) {
        console.error('Error:', error);
    }

    // const id = document.getElementById("declineOrderId").innerHTML.slice(4);
    document.getElementById("declineError").innerHTML = "";
    declineRequest(orderId, declineReason);
  });
  // order detail
  const currentURL = window.location.href;
  const urlParams = new URLSearchParams(new URL(currentURL).search);
  const orderId = urlParams.get("id");
  const orderStatus = urlParams.get("status");
  fetchOrderDetail(orderId, orderStatus);
});
