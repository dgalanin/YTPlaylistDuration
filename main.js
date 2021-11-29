const formElem = document.querySelector("#form");
const inputElem = document.querySelector("#url");
const resultElem = document.querySelector("h2");

formElem.addEventListener('submit', event => {
  event.preventDefault();
  try {
    const url = new URL(inputElem.value);
    getYtPlaylistLength(url).catch(() => {
      resultElem.innerHTML = "Invalid URL!";
      resultElem.classList = ["danger"];
    }).then(res => {
      if (res) {
        resultElem.innerHTML = `Playlist duration: ${res}`;
        resultElem.classList = ["success"];
        inputElem.value = "";
      }
    });
  } catch (e) {
    resultElem.innerHTML = "Invalid URL!";
    resultElem.classList = ["danger"];
  }
})

async function getYtPlaylistLength(url) {

    const API_KEY = "AIzaSyDVYWoT25lATruyGaj8Tz3ssD3KayKbKGg";
    const playlist_id = url.searchParams.get("list");

    const response_url = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${playlist_id}&key=${API_KEY}`;
    const response = await fetch(response_url);
    const data = await response.json();

    const videos = data.items;
    let videos_id = [];
    for (let video of videos) {
      videos_id.push(video.contentDetails.videoId);
    }

    let videos_duration_milliseconds = 0;

    for (let video_id of videos_id) {
      const video_response_url = `https://www.googleapis.com/youtube/v3/videos?id=${video_id}&key=${API_KEY}&part=snippet,contentDetails`;
      const video_response = await fetch(video_response_url);
      const video_data = await video_response.json();
      const video_time = video_data.items[0].contentDetails.duration;
      videos_duration_milliseconds += moment.duration(video_time)._milliseconds;
    }


    return moment.utc(videos_duration_milliseconds).format('HH:mm:ss');

}

