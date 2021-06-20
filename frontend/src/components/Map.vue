<template>
  <div>
    <div id="map"></div>
    <div class="button-group">
      <button @click="changeSize(800)">show</button>
      <form v-on:submit.prevent="user">
      <button type="submit" @click="displayMarker(markerPositions1)">내가등록한거조회</button>
      <!-- <p>위도 : {{User_LATITUDE}},{{User_LONGITUDE}}</p> -->
      </form>
      <form v-on:submit.prevent="member">
      <button type="submit" @click="displayMarker(markerPositions2)" >전체회원조회</button>
      <!-- <button type="submit">전체조회</button> -->
      <!-- <p>위도 : {{User_LATITUDE}},{{User_LONGITUDE}}</p> -->
    </form>
      <button @click="displayMarker([])">마커 안보이게 하기</button>
    </div>
    <form v-on:submit.prevent="reviewlist">
    <b-button ref="sidebar1" type="submit" v-b-toggle.sidebar>Toggle Sidebar</b-button>
    </form>
    <b-sidebar ref="sidebar" id="sidebar" bg-variant="dark" title="캠핑 리뷰" text-variant="light" width='500px' right shadow>
  
      <div>
        <p class="px-3" >작성자: {{ $cookies.get("UserID") }} 위도: {{ User_LATITUDE1 }} 경도: {{ User_LONGITUDE1 }} </p>
        <b-img :src="imageUrl" width=460 height=300 class="px-3 py-2"></b-img>
      </div>
      <div class="px-3 py-2 mt-4" >
        <p class="mt-3">별점</p>
         <b-form-rating
        v-model="RANK"
        readonly
        show-string
        show-value-max
        variant="warning"
        ></b-form-rating>
        <p class="mt-3">장소명</p>
       <b-form-textarea
              v-model="PLACENAME"
              id="PLACENAME"
              plaintext :value="PLACENAME"
              rows="1"
              
              text-variant="light" 
              >
              </b-form-textarea>
        <p class="mt-3">리뷰</p>
            <b-form-textarea
              v-model="REVIEW"
              id="REVIEW"
              plaintext :value="REVIEW"
              rows="3"
              max-rows="8"
              >
              </b-form-textarea>
              
              </div>
      <div class="px-3 py-2">
      </div>
      <b-button v-b-toggle.sidebar-up>리뷰 업로드</b-button>
         <template #footer="{ hide }">
           <form v-on:submit.prevent="reviewup">
           <b-sidebar id="sidebar-up" aria-label="Sidebar with custom footer" bg-variant="dark" text-variant="light" width='500px' right shadow>
            <div>
              <p class="px-3" >작성자: {{ $cookies.get("UserID") }} 위도: {{ User_LATITUDE1 }} 경도: {{ User_LONGITUDE1 }} </p>
              <b-img :src="imageUrl" width=500 height=300 class="px-3 py-2"></b-img>
              </div>
            <div class="px-3 py-2" >
              <input v-on:change='fileSelect()' type="file" ref="Spot_IMG" id="Spot-IMG" accept=".gif, .jpg, .png">
              <p class="mt-3">별점</p>
              <b-form-rating v-model="Spot_RANK" variant="warning" class="mb-3" show-value>
              </b-form-rating>
              <b-form-group
              v-model="placename"
              id="fieldset-1"
              label="장소명"
              class="mb-3"
              label-for="input-1"
              :invalid-feedback="invalidFeedback"
              :state="state"
              >
                <b-form-input id="input-1" v-model="Spot_PLACENAME" :state="state" trim></b-form-input>
              </b-form-group>
            <p class="mt-3">리뷰</p>
            <b-form-textarea
              v-model="Spot_REVIEW"
              id="Spot_REVIEW"
              label="리뷰"
              label-for="input-2"
              rows="3"
              max-rows="8"
              >
                <b-form-input id="input-2" v-model="Spot_REVIEW" :state="state" trim></b-form-input>
              </b-form-textarea>
            </div>
              <strong class="px-2 py-2"></strong>
              <b-button  size="sm" @click="hide">지도보기</b-button>
              <b-button type="submit" size="sm" >업로드</b-button>
            
            </b-sidebar>
            </form>
          </template>
    </b-sidebar>
  </div>
</template>

<script>
export default {
  name: "KakaoMap",
  computed: {
      state() {
        return this.Spot_PLACENAME.length >= 2
      },
      invalidFeedback() {
        if (this.Spot_PLACENAME.length > 0) {
          return '두글자이상입력해주세요'
        }
        return '장소명을 입력해주세요'
      }
    },
  data:  () => ({
      map: null,
      markerPositions1: [],
      markerPositions2: [],
      markers: [],
      infowindow: null,
      rows: '',
      User_LATITUDE:'',
      User_LONGITUDE:'',
      User_LATITUDE1:'',
      User_LONGITUDE1:'',
      User_LATITUDE2:'36.32318540016535',
      User_LONGITUDE2:'127.33822637887128',
      rank: 3,
      upload: '',
      placename: '',
      Spot_PLACENAME: '',
      Spot_IMG:'',
      Spot_RANK:'',
      Spot_REVIEW:'',
        show: true,
        previewImageData: null,
        value:'',
        User_ID:'rs3rs3',
        imageUrl: '',
        sidebar:'',
        RANK:[],
        PLACENAME:[],
        REVIEW:[],


  }),
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=9d116fa14f73b9ca6e6e3f428a03d257";
      document.head.appendChild(script);
    }
  },
  methods: {
    initMap() {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 5,
      };
      this.map = new kakao.maps.Map(container, options);
    },
    changeSize(size) {
      const container = document.getElementById("map");
      container.style.width = `${size}px`;
      container.style.height = `${size}px`;
      this.map.relayout();
    },
    displayMarker(markerPositions) {
     
    
     if (this.markers.length > 0) {
        this.markers.forEach((marker) => marker.setMap(null));
      }

      const positions = markerPositions.map(
        (position) => new kakao.maps.LatLng(...position)
      );

      if (positions.length > 0) {
        this.markers = positions.map(
          (position) =>
            new kakao.maps.Marker({
              map: this.map,
              position,
            })
        );

        const bounds = positions.reduce(
          (bounds, latlng) => bounds.extend(latlng),
          new kakao.maps.LatLngBounds()
        );

        this.map.setBounds(bounds);
      }
      this.markers = positions.map((position) => {
      const marker = new kakao.maps.Marker({
          map: this.map,
          position
      });

        //마커 클릭 이벤트를 등록합니다.
      // kakao.maps.event.addListener(marker, 'click',function(event) { // eslint-disable-line no-unused-vars
      //   console.log(marker.getPosition());
      //   this.$ref.sidebar
      // });
      kakao.maps.event.addListener(marker, 'click', (event) => { // eslint-disable-line no-unused-vars
        console.log(marker.getPosition());
        // this.$refs.sidebar.toggle()
        this.$refs.sidebar.right
        this.$refs.sidebar.shadow
        console.log(this.$refs.sidebar);
        
        // this.$refs.sidebar.hide();
        // this.$refs.sidebar.toggle();
      });

      return marker;
      });
    },
    
    // 로그인한 유저의 좌표만 불러와서 마커표시
    user: function (event){// eslint-disable-line no-unused-vars
        this.$http.post('/api/spot/user', {
           User_ID: this.$cookies.get("UserID")
      })
      .then((res) => {
        if (res.data.rows) {  
         for (let i = 0; i<5 ; i++) { 
        this.User_LATITUDE = res.data.rows[i].User_LATITUDE
        this.User_LONGITUDE = res.data.rows[i].User_LONGITUDE
        
        this.markerPositions1.push([this.User_LATITUDE,this.User_LONGITUDE])
        this.User_LATITUDE1 = res.data.rows[0].User_LATITUDE
        this.User_LONGITUDE1 = res.data.rows[0].User_LONGITUDE
         }
        } else { 
          alert ('로그인이 필요한 서비스입니다');
        }return;
        
         
      })
    },
    // 회원전체의 좌표불러와서 회원전체의 마커불러오기
    member: function (event){// eslint-disable-line no-unused-vars
        this.$http.post('/api/spot/member', {
      })
      .then((res) => {
         for (let i = 0; i<5 ; i++) { 
        this.User_LATITUDE = res.data.rows[i].User_LATITUDE
        this.User_LONGITUDE = res.data.rows[i].User_LONGITUDE
        this.markerPositions2.push([this.User_LATITUDE,this.User_LONGITUDE])
        // this.markerPositions2.push([this.User_LATITUDE,this.User_LONGITUDE])
         }
      })
    },
    
    //저장된 리뷰 불러오기
    reviewlist: function (event){ // eslint-disable-line no-unused-vars
    this.$http.post('/api/reviewlist', {
      User_LATITUDE2: this.User_LATITUDE2,
      User_LONGITUDE2: this.User_LONGITUDE2
      })
      .then((res) => {
        console.log(res.data.rows);
        this.Spot_RANK = res.data.rows[0].Spot_RANK
        this.Spot_PLACENAME = res.data.rows[0].Spot_PLACENAME
        this.Spot_REVIEW = res.data.rows[0].Spot_REVIEW
        this.RANK.push(res.data.rows[0].Spot_RANK)
        this.PLACENAME.push(this.Spot_PLACENAME)
        this.REVIEW.push(this.Spot_REVIEW )

      })
    },

    fileSelect(){
      this.Spot_IMG = this.$refs.Spot_IMG.files[0]
      this.imageUrl = URL.createObjectURL(this.Spot_IMG);
    },
    //리뷰 업로드
    reviewup: function (event){ // eslint-disable-line no-unused-vars
      const formData = new FormData();
      formData.append('User_ID', this.User_ID);
      formData.append('User_LATITUDE', this.User_LATITUDE1);
      formData.append('User_LONGITUDE', this.User_LONGITUDE1);
      formData.append('Spot_IMG', this.Spot_IMG);
      formData.append('Spot_RANK', this.Spot_RANK);
      formData.append('Spot_PLACENAME', this.Spot_PLACENAME);
      formData.append('Spot_REVIEW', this.Spot_REVIEW);

      this.$http.post('/api/spot/reviewup', formData, {
        // User_ID: this.UserID,
        // User_LATITUDE: this.User_LATITUDE1,
        // User_LONGITUDE: this.User_LONGITUDE1,
        // Spot_IMG: this.Spot_IMG,
        // Spot_RANK: this.Spot_RANK,
        // Spot_PLACENAME: this.Spot_PLACENAME,
        // Spot_REVIEW: this.Spot_REVIEW
        })
        console.log(this.User_ID, this.User_LATITUDE,this.User_LONGITUDE,this.Spot_IMG, this.Spot_RANK,this.Spot_PLACENAME,this.Spot_REVIEW)
        .then((res) => { 
          alert (res.data.msg); 
        }) 
    }
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  width: 1706px;
  height: 600px;
}

.button-group {
  margin: 10px 0px;
}

button {
  margin: 0 3px;
}
  
#sidebar-right {
  width: 1000px;
}

</style>
