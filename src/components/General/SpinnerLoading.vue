<template>
  <div class="wrapper">
    <div class="lds-ellipsis-load">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpinnerLoading',
}
</script>

<style lang="scss" scoped>

.wrapper {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1021;
}

#logout-spinner-wrapper {
  background: #fff;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: block;
  z-index: 99999;
  width: 100%;
  height: 100%;
  position: fixed;
  text-align: center;
}

.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  margin-top: calc(50vh - 220px);
}
.lds-ellipsis-load {
	display: inline-block;
	position: relative;
	width: 64px;
	height: 64px;
	top: 50%;
	left: 50%;
}
.lds-ellipsis div,
.lds-ellipsis-load div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #ccc;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1),
.lds-ellipsis-load div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2),
.lds-ellipsis-load div:nth-child(2)  {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3),
.lds-ellipsis-load div:nth-child(3)  {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4),
.lds-ellipsis-load div:nth-child(4)  {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}

</style>

