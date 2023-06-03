export default (seconds) => {
  var minutes = Math.floor(seconds / 60);
  var secondsPart = seconds % 60;

  var formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  var formattedSeconds = secondsPart < 10 ? "0" + secondsPart : secondsPart;

  return formattedMinutes + ":" + formattedSeconds;
}