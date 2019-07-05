import React from "react";
import AppLogo from "../../assets/NUS_ALSET_Achievements_Logo.png";
import Button from "@material-ui/core/Button";

function HomeV4() {
  return (
    <main>
      <section
        style={{
          width: "100%",
          height: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <img src={AppLogo} style={{ minWidth: "200px", maxWidth: "30%", mixBlendMode: "darken" }} alt="" />
        <p style={{ fontWeight: 200, fontSize: "1.5rem", textAlign: "center" }}>A learning platform for programmers</p>
      </section>
      <section
        style={{
          display: "flex",
          flexDirection: "row",
          alignContent: "stretch",
          justifyContent: "center",
          flexWrap: "wrap"
        }}
      >
        <article
          style={{
            flexGrow: 1,
            textAlign: "center",
            margin: "0.5rem",
            backgroundColor: "white",
            boxShadow: "rgba(0, 0, 0, 0.14) 0px 0px 4px 0px, rgba(0, 0, 0, 0.28) 0px 4px 8px 0px"
          }}
        >
          <h3>Master Python</h3>
          <ul style={{ textAlign: "left" }}>
            <li>Practice on Jupyter notebooks</li>
            <li>Over 100 CodeCombat levels to explore</li>
            <li>Attempt Machine Learning problems</li>
          </ul>
        </article>
        <article
          style={{
            flexGrow: 1,
            textAlign: "center",
            margin: "0.5rem",
            backgroundColor: "white",
            boxShadow: "rgba(0, 0, 0, 0.14) 0px 0px 4px 0px, rgba(0, 0, 0, 0.28) 0px 4px 8px 0px"
          }}
        >
          <h3>Take charge of learning</h3>
          <ul style={{ textAlign: "left" }}>
            <li>Complete activities at your own pace</li>
            <li>Explore your own learning analytics</li>
            <li>Download your data for analysis</li>
          </ul>
        </article>
        <article
          style={{
            flexGrow: 1,
            textAlign: "center",
            margin: "0.5rem",
            backgroundColor: "white",
            boxShadow: "rgba(0, 0, 0, 0.14) 0px 0px 4px 0px, rgba(0, 0, 0, 0.28) 0px 4px 8px 0px"
          }}
        >
          <h3>Learn by teaching</h3>
          <ul style={{ textAlign: "left" }}>
            <li>Create custom notebook problems</li>
            <li>Create custom lambda functions</li>
            <li>Build CodeCombat Multiplayer levels</li>
          </ul>
        </article>
      </section>
      <hr style={{ marginTop: "2rem" }} />
      <section>
        <h2>Features</h2>
        <article style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
          <section
            style={{
              width: "90%",
              minHeight: "200px",
              backgroundSize: "cover",
              backgroundImage: `url(https://res.cloudinary.com/dypcybha2/image/upload/q_auto:low,f_auto,o_30/v1562139090/jupyterActivity.png)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              boxShadow: "rgba(0, 0, 0, 0.14) 0px 0px 4px 0px, rgba(0, 0, 0, 0.28) 0px 4px 8px 0px"
            }}
          >
            <div style={{ padding: "1rem", alignSelf: "end", marginTop: "auto" }}>
              <h3>Jupyter notebooks</h3>
              <p>Our notebook problems support popular packages such as Pandas, Scikit-Learn and even tensorflow etc</p>
            </div>
          </section>
          <section
            style={{
              width: "90%",
              minHeight: "200px",
              backgroundSize: "cover",
              backgroundImage: `url(https://res.cloudinary.com/dypcybha2/image/upload/q_auto:low,f_auto,o_30/v1562145128/myLearning.png)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "2rem",
              backgroundColor: "white",
              boxShadow: "rgba(0, 0, 0, 0.14) 0px 0px 4px 0px, rgba(0, 0, 0, 0.28) 0px 4px 8px 0px"
            }}
          >
            <div style={{ padding: "1rem", alignSelf: "end", marginTop: "auto" }}>
              <h3>Learning analytics</h3>
              <p>Track your own learning analytics</p>
            </div>
          </section>
          <section
            style={{
              width: "90%",
              minHeight: "200px",
              backgroundSize: "cover",
              backgroundImage: `url(https://res.cloudinary.com/dypcybha2/image/upload/q_auto:low,f_auto,o_30/v1562145432/customActivity.png)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "2rem",
              backgroundColor: "white",
              boxShadow: "rgba(0, 0, 0, 0.14) 0px 0px 4px 0px, rgba(0, 0, 0, 0.28) 0px 4px 8px 0px"
            }}
          >
            <div style={{ padding: "1rem", alignSelf: "end", marginTop: "auto" }}>
              <h3>Design your own custom problems</h3>
              <p>Create your own custom notebook / serverless problems and more!</p>
            </div>
          </section>
        </article>
      </section>
      <hr style={{ marginTop: "2rem" }} />
      <section>
        <h2>Accessing Achievements</h2>
        <p>All the features and course material in Achievements are free for anyone to access.</p>
        <p>You just need to login with your Google account.</p>
        <Button color="primary" size="large" variant="contained" style={{ marginTop: "1rem" }}>
          Get started
        </Button>
      </section>
    </main>
  );
}
export default HomeV4;
