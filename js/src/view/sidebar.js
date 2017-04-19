let $ = require('lib/jquery-3.1.1.min.js');

$(() => {
  let createRoomButton = $('#createRoomButton');
  createRoomButton.click(() => {
    let videoLink = $('#video-link-input').val();
    $.ajax({
      data: {
        videoLink: videoLink,
      },
      error: (data) => {
        console.log(data);
      },
      success: (data) => {
        window.location.replace("/room/" + data);
      },
      url: '/api/createRoom',
    });
  });
});
