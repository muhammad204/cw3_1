<template>
  <div>
    <h2>Shopping cart</h2>
    <ul class="row">
      <li v-for="item in cartCourses" :key="item.course.id" class="card col-md-3 m-2 shadow">
        <img v-bind:src="item.course.image" class="ct height: 200px; width: 100%; mx-auto d-block card-img-top" />
        <div class="card-body">
          <h2 class="card-title">{{ item.course.title }}</h2>
          <p class="card-text">Location: {{ item.course.location }}</p>
          <p class="card-text">Price: {{ item.course.price }}</p>
          <p class="card-text">Quantity: {{ item.count }}</p>

          <button @click="removeItem(item.course.id)" class="btn btn-outline-danger">
            Remove
          </button>
        </div>
      </li>
    </ul>

    <h2>Checkout</h2>
    <p>
      <strong>First Name:</strong>
      <input v-model.trim="order.firstName" id="firstName" type="text" class="form-control-sm m-2"
        pattern="^[a-zA-Z\s]+$" />
    </p>

    <p>
      <strong>Phone Number:</strong>
      <input v-model.number="order.phoneNumber" id="phoneNumber" type="number" class="form-control-sm m-2" />
    </p>

    <h2>Order Information</h2>
    <p>First Name: {{ order.firstName }}</p>
    <p>phone Number: {{ order.phoneNumber }}</p>

    <button type="submit" v-bind:disabled="!validInput" v-on:click="submitForm" class="mb-4 btn">
      Place Order
    </button>
  </div>
</template>

<script>
export default {
  name: "Form-Component",
  props: ['cart', 'courses'],
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
    cartCourses() {
      const selectedCourses = {};

      this.cart.forEach((id) => {
        if (selectedCourses[id]) {
          selectedCourses[id].count++;
        } else {
          const course = this.courses.filter((c) => c.id === id)[0];
          if (course) {
            selectedCourses[id] = { course, count: 1 };
          }
        }
      });

      return Object.values(selectedCourses);
    },

    validInput() {
      return (
        /^[a-zA-Z\s]+$/.test(this.order.firstName) &&
        /^\d+$/.test(this.order.phoneNumber)
      );
    },
  }
};
</script>