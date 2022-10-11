import path from "node:path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
//@ts-ignore
import ffProbe from "@ffprobe-installer/ffprobe";

ffmpeg.setFfmpegPath(ffmpegPath.path);
ffmpeg.setFfprobePath(ffProbe.path);

const INPUT = path.join(__dirname, "input/input.mp4");

async function cutVideo() {
  const TIMESTAMPS = [
    ["00:00:00", "00:00:15"],
    ["00:00:30", "00:00:45"],
  ];

  return new Promise((resolve, reject) => {
    TIMESTAMPS.map((time, index) => {
      ffmpeg(INPUT)
        .setStartTime(time[0])
        .setDuration(time[1])
        .videoFilters([
          {
            filter: "fade",
            options: "in:0:15",
          },
        ])
        .save(path.join(__dirname, `output/output${index}.mp4`))
        .on("start", (commandLine) => {
          console.log("Spawned Ffmpeg with command: " + commandLine);
        })
        .on("end", () => {
          resolve("DONE!!");
        })
        .on("error", function (err, stdout, stderr) {
          if (err) {
            console.log(err.message);
            console.log("stdout:\n" + stdout);
            console.log("stderr:\n" + stderr);
            reject(err);
          }
        });
    });
  });
}
