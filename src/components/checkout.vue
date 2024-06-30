<template>
    <div>
      <h2>Shopping cart</h2>
        <ul class="row">
          <li v-for="item in cart" :key="item.id" class="card col-md-3 m-2 shadow">
            <img
              v-bind:src="item.image"
              class="ct height: 300px; width: 100%; mx-auto d-block img-fluid"
            />
            <div class="card-body">
              <h2>{{item.title}}</h2>
              <p>Location: {{item.location}}</p>
              <p>Price: {{item.price}}</p>
              <p>Quantity: {{item.count}}</p>
      
              <button @click="removeItem(item)" class="btn btn-outline-danger">
                Remove
              </button>
            </div>
          </li>
        </ul>

        <h2>Checkout</h2>
        <p>
          <strong>First Name:</strong>
          <input
            v-model.trim="order.firstName"
            id="firstName"
            type="text"
            class="form-control-sm"
            pattern="^[a-zA-Z\s]+$"
          />
        </p>

        <p>
          <strong>Phone Number:</strong>
          <input
            v-model.number="order.phoneNumber"
            id="phoneNumber"
            type="number"
            class="form-control-sm"
          />
        </p>

        <h2>Order Information</h2>
        <p>First Name: {{order.firstName}}</p>
        <p>phone Number: {{order.phoneNumber}}</p>

        <button type="submit" v-bind:disabled="!validInput" v-on:click="submitForm">
          Place Order
        </button>
      </div>
  </template>
  
  <script>
  export default {
    name: "Form-Component",
    props: ['cart'],
    data() {
      return { 
        order: {
        firstName: "",
        phoneNumber: ""
      }
      };
    },
    methods: {
      removeItem(index) {
        // Emit an event to notify the parent component to remove the item
        this.$emit('remove-item', index);
      },
      submitForm() {
        // Here you can emit an event or call an API to submit the form
        // For example:
        this.$emit('submit-form', { Name: this.order.firstName, PhoneNumber: this.order.phoneNumber });
        
        console.log("Form submitted with:", this.name, this.address);
        // Reset form fields after submission
        this.name = "";
        this.address = "";
      },
      async checkout() {
      var order = {
        // all cart items
        courses: [...this.cart],
        firstName: this.order.firstName,
        phoneNumber: this.order.phoneNumber,
      };

      this.cart.forEach((item) => {
        item = this.courses.filter((course) => course.id == item)[0];
        item.availableInventory -= this.cartCount(item.id);
        fetch(`https://cw-2-smoky.vercel.app/collection/courses/${item._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            availableInventory: item.availableInventory,
          }),
        });
      });

      await fetch("https://cw-2-smoky.vercel.app/collection/orders/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      alert("order successful");
      //this.cart = [];
      this.showCourse = true;
    },
    },
    computed: {
      validInput() {
      return (
        /^[a-zA-Z\s]+$/.test(this.order.firstName) &&
        /^\d+$/.test(this.order.phoneNumber)
      );
    },
    }
  };
  </script>