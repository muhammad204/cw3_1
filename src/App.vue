<template class="bg-light">
  <div id="app" class="container">
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow p-3 mb-3 row">
      <div class="collapse navbar-collapse col-md-6">
        <h1 v-text="sitename" class="mt-5"></h1>
      </div>
      <div class="m-3 col-md-6">
          <button v-bind:disabled="cart.length == 0" v-on:click="showCheckout"
            class="btn btn-outline-success btn-lg float-end m-4 p-2">
            Checkout {{ cartItemCount }}</button><br />
      </div>
    </nav>
    <main>
      <div v-if="showCourse">
        <course-list :is="currentComponent" @addcourse="addToCart" @canCart="canAddToCart"
          @cartcounter="cartCount"></course-list>
      </div>

      <div v-else>
        <checkout :cart="cart" :courses='courses' @cartCount="cartCount" @removeItem="removeFromCart" @submitForm="submitForm"></checkout>
      </div>
    </main>
  </div>
</template>

<script>
import courseList from "./components/courses.vue";
import checkout from "./components/checkout.vue";
export default {
  name: "app",
  data() {
    return {
      currentComponent: "courseList",
      sitename: "Welcome to After School!",
      courses: [],
      searchQuery: "",
      cart: [],
      showCourse: true,
      sortOption: "title",
      sortOrder: "asc",
      order: {
        firstName: "",
        phoneNumber: "",
      },
    };
  },
  components: {
    courseList,
    checkout,
  },

  created() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("service-worker.js");
    }
    this.getCourses();
  },

  methods: {
    toggleComponent() {
      this.currentComponent =
        this.currectComponent === "courseList" ? "checkout" : "courseList";
    },

    // method to get lessons from mongo db
    async getCourses() {
      var url = "https://cw-2-smoky.vercel.app/collection/courses/";
      var courses = await fetch(url);
      courses = await courses.json();
      this.courses = courses;
      console.log("fetched");
    },

    async searchCourses() {
      var query = {
        search: this.searchQuery,
        sort: this.sortOption,
        order: this.sortOrder,
      };
      var courses = await fetch(
        "https://cw-2-smoky.vercel.app/collection/courses/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(query),
        }
      );
      courses = await courses.json();
      this.courses = courses;
      console.log("fetched");
    },

    addToCart(course) {
      this.cart.push(course.id);
      course.availableInventory--;
    },

    removeFromCart(courseID) {
      const index = this.cart.indexOf(courseID);
      if (index !== -1) {
        this.cart.splice(index, 1);
      }
    },

    showCheckout() {
      this.showCourse = !this.showCourse;
    },

    submitForm() {
      alert("Order submitted!");
    },

    canAddToCart(course) {
      return course.availableInventory > this.cartCount(course.id);
    },

    cartCount(id) {
      let count = 0;
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i] === id) {
          count++;
        }
      }
      return count;
    },
  },

  computed: {
    cartItemCount() {
      return this.cart.length;
    },
    cartCourses() {
      const selectedCourses = {};

      this.cart.forEach((id) => {
        if (selectedCourses[id]) {
          selectedCourses[id].count++;
        } else {
          const course = this.courses.find((c) => c.id === id);
          if (course) {
            selectedCourses[id] = { course, count: 1 };
          }
        }
      });

      return Object.values(selectedCourses);
    },

    sortedCourses() {
      var coursesArray = this.courses;
      var order = this.sortOrder === "asc" ? 1 : -1;

      if (this.searchQuery) {
        var query = this.searchQuery.toLowerCase();
        coursesArray = coursesArray.filter(
          (c) =>
            c.title.toLowerCase().includes(query) ||
            c.location.toLowerCase().includes(query)
        );
      }
      return coursesArray.sort((a, b) => {
        if (a[this.sortOption] > b[this.sortOption]) return 1 * order;
        if (a[this.sortOption] < b[this.sortOption]) return -1 * order;
        return 0;
      });
    },
  },
};
</script>
