<template>
     <div role="group">
       <form v-on:submit.prevent="join">
        <b-card
        header="Snail Tent"
        style="max-width: 35rem; margin: auto; margin-top: 10vh;"
        class="mb-2"
        border-variant="info"
        align="left">
        <label for="input-live">아이디:</label>
        <b-form-input
          id="input-live"
          v-model="User_ID"
          :state="IDState"
          aria-describedby="input-live-feedback"
          placeholder="아이디를 입력하세요"
          class="mb-2"
          trim
        ></b-form-input>
        <!-- This will only be shown if the preceding input has an invalid state -->
        <b-form-invalid-feedback id="input-live-feedback">
          아이디를 6자 이상 입력하세요!
        </b-form-invalid-feedback>
        <label for="input-live">비밀번호:</label>
        <b-form-input
          id="input-live"
          v-model="User_PW"
          :state="PWState"
          aria-describedby="input-live-feedback"
          placeholder="비밀번호를 입력하세요"
          class="mb-2"
          trim
        ></b-form-input>
        <!-- This will only be shown if the preceding input has an invalid state -->
        <b-form-invalid-feedback id="input-live-feedback">
        비밀번호를 6자 이상 입력하세요!
        </b-form-invalid-feedback>
        <label for="input-live">이름:</label>
        <b-form-input
          id="input-live"
          v-model="User_NAME"
          placeholder="이름을 입력하세요"
          class="mb-2"
          trim
        ></b-form-input>
        <label for="input-live">성별:</label>
        <b-form-radio-group
          v-model="User_SEX"
          :options="options"
          class="mb-3"
          value-field="item"
          text-field="name"
          disabled-field="notEnabled"
        ></b-form-radio-group>
        <label for="input-live">전화번호:</label>
        <b-form-input
          id="input-live"
          v-model="User_PHONE"
          placeholder="전화번호을 입력하세요"
          class="mb-2"
          trim
        ></b-form-input>
        <label for="input-live">이메일:</label>
        <b-form-input
          id="input-live"
          v-model="User_EMAIL"
          placeholder="이메일을 입력하세요"
          class="mb-2"
          type="email"
          trim
        ></b-form-input>
        <b-row>
          <b-col sm="12" class="mt-4">
            <b-button type="submit" variant="outline-primary" block>회원가입</b-button>
          </b-col>
        </b-row>
    </b-card>
  </form>
</div>
</template>
<script>
export default {
    name : "join",
    computed: {
      IDState() {
        return this.User_ID.length > 5 ? true : false
      },
      PWState() {
        return this.User_PW.length > 5 ? true : false
      }
    },
  data: function () {
    return {
        User_ID: "",
        User_PW: "",
        User_NAME: "",
        User_SEX: "",
        User_PHONE: "",
        User_EMAIL: "",
        selected: '남자',
        options: [
          { item: '남자', name: '남자' },
          { item: '여자', name: '여자' },
        ]
    }
  },
    methods: {
    join: function (event) {  // eslint-disable-line no-unused-vars
    console.log(this.User_ID,this.User_PW,this.User_NAME,this.User_SEX,this.User_PHONE,this.User_EMAIL)
      this.$http.post('/api/member/join', {
       User_ID: this.User_ID,
       User_PW: this.User_PW,
       User_NAME: this.User_NAME,
       User_SEX: this.User_SEX,
       User_PHONE: this.User_PHONE,
       User_EMAIL: this.User_EMAIL
      })
      .then((res) => { 
      if (res.data.result == true) { 
        this.$router.push('/'); 
        alert (res.data.msg); 
      } 
      }) 
      
    }
  }

}
</script>