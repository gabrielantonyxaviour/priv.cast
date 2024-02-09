// pages/api/hello.ts

import { NextApiRequest, NextApiResponse } from "next";
import satori from "satori";
import sharp from "sharp";
import { join } from "path";
import * as fs from "fs";

const fontPath = join(process.cwd(), "Lato-Regular.ttf");
let fontData = fs.readFileSync(fontPath);
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pollData = {
    question: "Which programming language do you prefer?",
    options: [
      { key: 1, text: "JavaScript", percentOfTotal: 30 },
      { key: 2, text: "Python", percentOfTotal: 25 },
      { key: 3, text: "Java", percentOfTotal: 20 },
      { key: 4, text: "C++", percentOfTotal: 25 },
    ],
  };
  const showResults = true;
  // Handle the request and send the response
  let imageUrl = "https://picsum.photos/400/200";
  const svg = await satori(
    <div
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "f4f4f4",
        padding: 50,
        lineHeight: 1.2,
        fontSize: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 20,
        }}
      >
        <h2 style={{ textAlign: "center", color: "lightgray" }}>
          {"poll.title"}
        </h2>
        {pollData.options.map((opt, index) => {
          return (
            <div
              key={opt.key}
              style={{
                backgroundColor: showResults ? "#007bff" : "",
                color: "#fff",
                padding: 10,
                marginBottom: 10,
                borderRadius: 4,
                width: `${showResults ? opt.percentOfTotal : 100}%`,
                whiteSpace: "nowrap",
                overflow: "visible",
              }}
            >
              {opt.text}
            </div>
          );
        })}
        {/*{showResults ? <h3 style={{color: "darkgray"}}>Total votes: {totalVotes}</h3> : ''}*/}
      </div>
    </div>,
    {
      width: 600,
      height: 400,
      fonts: [
        {
          data: fontData,
          name: "Roboto",
          style: "normal",
          weight: 400,
        },
      ],
    }
  );

  const pngBuffer = await sharp(Buffer.from(svg)).toFormat("png").toBuffer();

  // Set the content type to PNG and send the response
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "max-age=10");
  res.send(pngBuffer);
}