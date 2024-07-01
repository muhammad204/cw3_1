<template>
  <div class="row">
    
    <div class="col-md-4">
    <input v-model="searchQuery" class="form-control" style="width: 350px" type="text" placeholder="Search for courses" />
    </div>

    <div class="col-md-4">
    <select v-model="sortOption" class="form-control" style="width: 350px">
      <option value="title">Title</option>
      <option value="location">Location</option>
      <option value="price">Price</option>
    </select>
    </div>
    
    <div class="col-md-4">
    <select v-model="sortOrder" class="form-control" style="width: 350px">
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
    </div>

    <div class="row m-4">
      <div class="col-md-4" v-for="course in sortedCourses" :key="course.id">
        <div class="card m-3 shadow">
          <img
            :src="'https://cw-2-smoky.vercel.app/' + course.image"
            class="ct height: 250px; width: 100%; mx-auto d-block card-img-top"
          />

          <div class="card-body">
            <h2 v-text="course.title" class="card-title"></h2>
            <p v-html="course.description" class="card-text"></p>
            <p class="card-text">Location: {{ course.location }}</p>
            <p class="card-text">Price: {{ course.price }}</p>

            <p>
              Available stock:
              {{ course.availableInventory - cartCount(course.id) }}
            </p>

            <button
              @click="addItem(course)"
              v-if="canAddToCart(course)"
              class="btn btn-outline-info"
            >
              Add to cart
            </button>
            <button disabled="disabled" v-else>Add to cart</button>
            <span v-if="course.availableInventory === cartCount(course.id)">
              All out!
            </span>

            <span
              v-else-if="course.availableInventory - cartCount(course.id) < 5"
            >
              Only {{ course.availableInventory - cartCount(course.id) }}
              left!
            </span>
            <span v-else>Buy now!</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "courseList",
  props: ["addcourse", "canCart"],
  data() {
    return {
      sitename: "Welcome to After School!",
      courses: [],
      searchQuery: "",
      cart: [],
      sortOption: "title",
      sortOrder: "asc",
    };
  },

  created() {
    this.getCourses();
  },

  methods: {
    async getCourses() {
      var url = "https://cw-2-smoky.vercel.app/collection/courses/";
      var courses = await fetch(url);
      courses = await courses.json();
      this.courses = courses;
      console.log("Courses fetched");
    },
    addItem(course) {
      this.$emit("addcourse", course);
    },
    canAddToCart(course) {
      return course.availableInventory > this.cartCount(course.id);
    },
    cartCount(id) {
      return this.cart.filter(courseId => courseId === id).length;
    },
  },

  computed: {
    sortedCourses() {
      var coursesArray = [...this.courses];
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
