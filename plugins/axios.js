export default function ({ $axios, redirect }) {
  $axios.onError(() => { redirect('/400') })
}
