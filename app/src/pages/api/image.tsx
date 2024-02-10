import type { NextApiRequest, NextApiResponse } from "next";
import satori from "satori";
import sharp from "sharp";
import { join } from "path";
import * as fs from "fs";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const fontFilePath = join(process.cwd(), "public", "Lato-Regular.ttf");
  let fontData = fs.readFileSync(fontFilePath);

  const pollData = {
    question: "Which programming language do you prefer?",
    cybil: true,
    options: [
      { key: 1, text: "JavaScript", percentOfTotal: 30 },
      { key: 2, text: "Python", percentOfTotal: 25 },
      { key: 3, text: "Java", percentOfTotal: 20 },
      { key: 4, text: "C++", percentOfTotal: 25 },
    ],
  };
  const showResults = false;
  // // Handle the request and send the response
  let imageUrl = "https://picsum.photos/400/200";
  const svg = await satori(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "#450C63",
        paddingLeft: 50,
        paddingRight: 50,
        fontSize: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <p
          style={{
            fontSize: 32,
            fontWeight: "bold",
            color: "#fff",
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1,
            marginBottom: 20,
          }}
        >
          priv.cast
        </p>
        <div
          style={{
            flex: 1,
            width: "80%",
            backgroundColor: "#FBF6FF",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            padding: 20,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
          <p
            style={{
              color: "#9508BF",
              fontSize: 18,
              lineHeight: 1,
              marginTop: 5,
              marginBottom: 5,
            }}
          >
            @gabrielaxy asks
          </p>
          <p
            style={{
              color: "#450C63",
              textTransform: "uppercase",
              fontWeight: "bold",
              marginTop: 5,
              marginBottom: 5,
              fontSize: 30,
            }}
          >
            {pollData.question}
          </p>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <p
              style={{
                color: "#9508BF",
                fontSize: 15,
                marginTop: "auto",
                marginBottom: 20,
                textAlign: "end",
                marginLeft: "auto",
              }}
            >
              Create anonymous polls on&nbsp;
              <span style={{ color: "#450C63" }}>priv.cast</span>
            </p>
          </div>
          <div
            style={{
              display: "flex",
            }}
          >
            <div style={{ display: "flex", marginTop: 5 }}>
              <div
                style={{
                  display: "flex",
                  borderRadius: "100%",
                  height: 12,
                  width: 12,
                  backgroundColor: "#450C63",
                  marginTop: "auto",
                  marginBottom: "auto",
                }}
              ></div>
              <p
                style={{
                  fontSize: 12,
                  marginTop: 0,
                  marginBottom: 0,
                  marginLeft: 5,
                  color: "#450C63",
                }}
              >
                Anonymous
              </p>
            </div>
            <div style={{ display: "flex", marginTop: 5, marginLeft: 20 }}>
              <div
                style={{
                  display: "flex",
                  borderRadius: "100%",
                  height: 12,
                  width: 12,
                  backgroundColor: "#450C63",
                  marginTop: "auto",
                  marginBottom: "auto",
                }}
              ></div>
              <p
                style={{
                  fontSize: 12,
                  marginTop: 0,
                  marginBottom: 0,
                  marginLeft: 5,
                  color: "#450C63",
                }}
              >
                Cybil Resistant
              </p>
            </div>
          </div>
        </div>
        {/* <h2 style={{ textAlign: "center", color: "lightgray" }}>
          {pollData.question}
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
        })} */}
        {/*{showResults ? <h3 style={{color: "darkgray"}}>Total votes: {totalVotes}</h3> : ''}*/}
      </div>
    </div>,
    {
      width: 600,
      height: 400,
      fonts: [
        {
          data: fontData,
          name: "Lato-Regular",
          style: "normal",
          weight: 400,
        },
      ],
    }
  );

  const pngBuffer = await sharp(Buffer.from(svg)).toFormat("png").toBuffer();

  // // Set the content type to PNG and send the response
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "max-age=10");
  res.send(pngBuffer);
}
