<template>
  <v-navigation-drawer
    v-model="isShowSideBar"
    right
    absolute
    style="width: 600px;"
  >
    <v-card flat v-if="selectedPlace">
      <v-card-title>
        {{
          selectedPlace.address.road
            ? selectedPlace.address.road
            : selectedPlace.address.jibun
        }}
        <v-btn
          icon
          style="margin-left: auto;"
          @click="isShowSideBar = !isShowSideBar"
        >
          <v-icon large>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-subtitle v-if="selectedPlace.address.road">
        {{ selectedPlace.address.jibun }}
      </v-card-subtitle>

      <v-card flat v-if="isShowWriting || selectedPlace.places.length === 0">
        <v-card-title>
          <v-text-field
            label="이름"
            hide-details="auto"
            v-model="name"
          ></v-text-field>
        </v-card-title>
        <v-card-subtitle>
          <v-text-field
            label="상세위치"
            hide-details="auto"
            v-model="detailAddress"
          ></v-text-field>
        </v-card-subtitle>
        <v-card-text>
          <v-textarea
            label="설명"
            hide-details="auto"
            v-model="description"
          ></v-textarea>
        </v-card-text>
        <v-card-text>
          평점
          <v-btn
            icon
            large
            :color="i < score ? 'yellow darken-2' : undefined"
            @click="score = i + 1"
            v-for="(v, i) in 5"
            :key="i"
          >
            <v-icon x-large>
              mdi-star
            </v-icon>
          </v-btn>
        </v-card-text>
        <v-card-text style="cursor: pointer;">
          <VueFileAgent
            ref="vueFileAgent"
            :multiple="true"
            :deletable="true"
            :accept="'image/*'"
            :maxSize="'10MB'"
            :maxFiles="1000"
            :meta="false"
            :uploadUrl="uploadUrl"
            :helpText="'이미지 파일을 선택하거나 드래그해서 올려놓으세요.'"
            :errorText="{
              type: '이미지 파일만 업로드할 수 있습니다.',
              size: '파일은 하나에 10mb 이하여야 합니다.',
            }"
            v-model="fileRecords"
          ></VueFileAgent>
        </v-card-text>
        <v-card-text style="text-align: center;">
          <v-btn style="margin: 0px 20px 0px 20px;" @click="savePlace()"
            >작성</v-btn
          >
          <v-btn
            style="margin: 0px 20px 0px 20px;"
            @click="isShowWriting = false"
            v-if="selectedPlace.places.length > 0"
            >취소</v-btn
          >
        </v-card-text>
      </v-card>
      <template v-else>
        <v-card
          v-for="v in selectedPlace.places"
          :key="v._id"
          style="margin: 10px;"
        >
          <v-card-title>{{ v.name }}</v-card-title>
          <v-card-subtitle>{{ v.detailAddress }}</v-card-subtitle>
          <v-card-text v-if="v.pictures.length > 0">
            <vueper-slides
              fixed-height="400px"
              fade
              :touchable="false"
              bullets-outside
            >
              <template v-slot:arrow-left>
                <v-icon style="font-size: 70px;">mdi-chevron-left</v-icon>
              </template>

              <template v-slot:arrow-right>
                <v-icon style="font-size: 70px;">mdi-chevron-right</v-icon>
              </template>

              <vueper-slide
                v-for="v2 in v.pictures"
                :key="v2._id"
                :image="v2.url"
              />
            </vueper-slides>
          </v-card-text>
          <v-card-text>
            <span
              style="color: #000000;"
              v-html="v.description.replace(/\n/g, '<br />')"
            >
            </span>
          </v-card-text>
          <v-card-text style="padding-top: 0px;">
            <div style="float: left;">
              <v-icon
                class="mx-0"
                :color="i2 < v.score ? 'yellow darken-2' : undefined"
                v-for="(v2, i2) in 5"
                :key="i2"
              >
                mdi-star
              </v-icon>
            </div>

            <div style="float: right;">
              {{ new Date(v.createTime).toLocaleString() }}
            </div>
            <br />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn icon @click="showWriting(v)">
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>

            <v-btn icon @click="removePlace(v._id)">
              <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-card>

    <v-fab-transition>
      <v-btn
        color="pink"
        dark
        absolute
        bottom
        left
        fab
        style="bottom: 15px;"
        @click="showWriting()"
        v-if="
          !isShowWriting && selectedPlace && selectedPlace.places.length !== 0
        "
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-navigation-drawer>
</template>

<script>
import ConfigManager from '@/config';
import { VueperSlides, VueperSlide } from 'vueperslides';
import 'vueperslides/dist/vueperslides.css';

export default {
  components: { VueperSlides, VueperSlide },
  data() {
    return {
      fileRecords: [
        {
          url: `${ConfigManager.config.url.file}/files/kiqy6go0p6255zqupn.png`,
        },
      ],
      uploadUrl: `${ConfigManager.config.url.api}/upload`,
      uploadHeaders: { 'X-Test-Header': 'vue-file-agent' },
      pictures: [],
      name: '',
      detailAddress: '',
      description: '',
      isShowWriting: false,
      score: 5,
      editId: null,
    };
  },
  watch: {
    isShowSideBar(n) {
      this.name = '';
      this.detailAddress = '';
      this.description = '';
      this.pictures = [];
      this.score = 5;
      this.fileRecords = [];
      this.editId = null;
      if (n) {
        this.$store.dispatch('main/getPlaceOne');
        this.isShowWriting = false;
      }
    },
  },
  methods: {
    // 글 작성 페이지 보여주기
    showWriting(editData = null) {
      if (editData === null) {
        this.name = '';
        this.detailAddress = '';
        this.description = '';
        this.pictures = [];
        this.score = 5;
        this.fileRecords = [];
        this.editId = null;
      } else {
        this.name = editData.name;
        this.detailAddress = editData.detailAddress;
        this.description = editData.description;
        this.pictures = [];
        this.score = editData.score;
        this.fileRecords = editData.pictures;
        this.editId = editData._id;
      }
      this.isShowWriting = true;
    },
    // 글 저장
    async savePlace() {
      const newPlace = [];
      for (let i = 0; i < this.fileRecords.length; i++) {
        newPlace.push({
          name:
            this.fileRecords[i].upload &&
            this.fileRecords[i].upload.data &&
            this.fileRecords[i].upload.data.fileName
              ? this.fileRecords[i].upload.data.fileName
              : typeof this.fileRecords[i].name === 'string'
              ? this.fileRecords[i].name
              : this.fileRecords[i].name(),
          lastModified: this.fileRecords[i].lastModified,
          sizeText: this.fileRecords[i].sizeText,
          size: this.fileRecords[i].size,
          type: this.fileRecords[i].type,
          ext: this.fileRecords[i].ext,
        });
      }
      console.log(newPlace);
      this.pictures = newPlace;

      if (this.editId !== null) {
        console.log(this.editId);
        console.log({
          coord: {
            x: this.selectedPlace.coord.x,
            y: this.selectedPlace.coord.y,
          },
          name: this.name,
          detailAddress: this.detailAddress,
          description: this.description,
          pictures: this.pictures,
          score: this.score,
        });
        await this.$axios.put(`/place/one/${this.editId}`, {
          address: this.selectedPlace.address,
          coord: {
            x: this.selectedPlace.coord.x,
            y: this.selectedPlace.coord.y,
          },
          name: this.name,
          detailAddress: this.detailAddress,
          description: this.description,
          pictures: this.pictures,
          score: this.score,
        });
      } else {
        await this.$axios.post('/place', {
          address: this.selectedPlace.address,
          coord: {
            x: this.selectedPlace.coord.x,
            y: this.selectedPlace.coord.y,
          },
          name: this.name,
          detailAddress: this.detailAddress,
          description: this.description,
          pictures: this.pictures,
          score: this.score,
        });
      }
      this.$store.dispatch('main/getPlaceOne');
      this.isNeedPlaceReload = true;
      this.isShowWriting = false;
    },
    // 장소 삭제
    async removePlace(id) {
      if (
        !(
          await this.$swal({
            icon: 'question',
            title: '정말로 삭제하시겠습니까?',
            showCancelButton: true,
          })
        ).isConfirmed
      )
        return;
      await this.$store.dispatch('main/removePlaceOne', id);
      if (this.selectedPlace.places.length === 0) this.isShowSideBar = false;
      this.isNeedPlaceReload = true;
    },
  },
  computed: {
    isShowSideBar: {
      get() {
        return this.$store.state.main.isShowSideBar;
      },
      set(value) {
        this.$store.commit('main/setIsShowSideBar', value);
      },
    },
    selectedPlace: {
      get() {
        return this.$store.state.main.selectedPlace;
      },
      set(value) {
        this.$store.commit('main/setSelectedPlace', value);
      },
    },
    isNeedPlaceReload: {
      get() {
        return this.$store.state.main.isNeedPlaceReload;
      },
      set(value) {
        this.$store.commit('main/setIsNeedPlaceReload', value);
      },
    },
  },
};
</script>

<style></style>
