<template>
<!-- <div class="back"> -->
   <div class="login">
     <form v-on:submit.prevent="login">
      <b-card
      header="Snail Tent"
      style="max-width: 35rem; margin: auto; margin-top: 10vh;"
      class="mb-2"
      border-variant="info"
      align="left">
        <b-form-group id="login">
          <b-container fluid>
            <b-row class="my-1">
              <b-col sm="12">
                <b-form-input v-model="User_ID" type="text" placeholder="아이디" />
                <b-form-input v-model="User_PW" type="password" placeholder="비밀번호" />
                <!-- <b-button href="#" variant="primary" block>Go somewhere</b-button>             -->
              </b-col>
            </b-row>
            <b-row>
              <b-col sm="6" class="my-5">
                <b-button type="submit" variant="outline-primary" block>로그인</b-button>
              </b-col>
    
              <b-col sm="6" class="my-5" >
                <b-button href="/join" variant="outline-primary" block>회원가입</b-button>
              </b-col>
            </b-row>
          </b-container>
        </b-form-group>
      </b-card>
      </form>
   </div>
<!-- </div> -->
</template>
<script>
export default {
    name : "login",
  data: function () {
    return {
        User_ID: "",
        User_PW: "",
    }
  },
    methods: {
    login: function (event) {// eslint-disable-line no-unused-vars
    console.log(this.User_ID, this.User_PW)
      this.$http.post('/api/member/login', {
        User_ID: this.User_ID,
        User_PW: this.User_PW
      })
      .then((res) => {
        if (res.data.result == true) { 
          alert (res.data.msg); 
          this.$cookies.set("UserID", this.User_ID);
          this.$router.push('/main'); 
        } else { 
          alert (res.data.msg);
        }return;       
      })
       
    }
    
  }

}
</script>

<style>
/*.back {*/
    /* The image used */
    /* background-image: url('../assets/img/back.jpg');*/

    /* Half height */
    /* height: 1000%;*/

    /* Center and scale the image nicely */
    /*-webkit-background-size: cover;*/
    /*-moz-background-size: cover;*/
   /* -o-background-size: cover;*/
   /* background-size: cover;*/

 /* }*/
</style>