<template>
    <div class="header">
        <b-navbar toggleable="lg" type="dark" variant="info">
            <b-navbar-brand>Snail Tent</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item v-bind:to="'/main'">Home</b-nav-item>
                    <b-nav-item v-bind:to="'/map'">Map</b-nav-item>
                    <b-nav-item v-bind:to="'/info'">제품정보</b-nav-item>
                    <b-nav-item v-bind:to="'/cctv'">cctv</b-nav-item>
                </b-navbar-nav>
                
                <b-navbar-nav class="ml-auto">

                <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
                    <template #button-content>
                        <!-- 쿠키에 저장된 아이디 불러오기 -->
                        <em>{{ $cookies.get("UserID") }}</em>
                    </template>
                    <b-dropdown-item href="/">logOut <em>{{this.$cookies.remove("UserID")}}</em> </b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</div>

</template>
<script>
export default {
    name: "header",
    data: function () {
        return {
        }
    },
}

</script>