import React from "react";
import AppLogo from "../../assets/NUS_ALSET_Achievements_Logo.png";
import Button from "@material-ui/core/Button";
import styles from "./HomeV4.module.css";

function HomePage(props) {
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
        <Button
          color="primary"
          size="large"
          variant="contained"
          style={{ marginTop: "1rem" }}
          onClick={props.loginHandler}
        >
          Get started
        </Button>
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
        <article className={styles.topHighlightCards}>
          <h3>Master Python</h3>
          <ul style={{ textAlign: "left" }}>
            <li>Practice on Jupyter notebooks</li>
            <li>Explore over 100 CodeCombat levels</li>
            <li>Attempt Machine Learning problems</li>
          </ul>
        </article>
        <article className={styles.topHighlightCards}>
          <h3>Take charge of learning</h3>
          <ul style={{ textAlign: "left" }}>
            <li>Complete activities at your own pace</li>
            <li>Explore your own learning analytics</li>
            <li>Download your data for analysis</li>
          </ul>
        </article>
        <article className={styles.topHighlightCards}>
          <h3>Learn by teaching</h3>
          <ul style={{ textAlign: "left" }}>
            <li>Create custom notebook problems</li>
            <li>Create custom lambda functions</li>
            <li>Build CodeCombat Multiplayer levels</li>
          </ul>
        </article>
      </section>
      <section className={styles.textContent}>
        <hr style={{ marginTop: "2rem" }} />
        <h2>Highlights</h2>
        <article style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
          <section style={{ width: "100%" }}>
            <div
              className={styles.fullWidthCards}
              style={{
                backgroundImage: `url(https://res.cloudinary.com/dypcybha2/image/upload/q_auto:low,f_auto,o_80/v1562139090/jupyterActivity.png)`
              }}
            />
            <h3>Jupyter notebooks</h3>
            <p className={styles.endingParagraph}>
              Our notebook problems support popular packages such as Pandas, Scikit-Learn and even Tensorflow etc
            </p>
          </section>
          <section style={{ width: "100%" }}>
            <div
              className={styles.fullWidthCards}
              style={{
                backgroundImage: `url(https://res.cloudinary.com/dypcybha2/image/upload/q_auto:low,f_auto,o_80/v1562145128/myLearning.png)`
              }}
            />
            <h3>Learning analytics</h3>
            <p className={styles.endingParagraph}>Track your own learning analytics</p>
          </section>
          <section style={{ width: "100%" }}>
            <div
              className={styles.fullWidthCards}
              style={{
                backgroundImage: `url(https://res.cloudinary.com/dypcybha2/image/upload/q_auto:low,f_auto,o_80/v1562145432/customActivity.png)`
              }}
            />
            <h3>Design your own custom problems</h3>
            <p>Create your own custom notebook / serverless problems and more!</p>
          </section>
        </article>
      </section>
      <section className={styles.textContent}>
        <hr style={{ marginTop: "2rem" }} />
        <h2>Accessing Achievements</h2>
        <h3>Pricing</h3>
        <p className={styles.endingParagraph}>
          All the features and course material in Achievements are free for everyone to access.
        </p>
        <h3>Guide</h3>
        <p className={styles.endingParagraph}>
          We have an extensive catalogue of publicly accessible activities curated into{" "}
          <i>
            <b>Paths</b>
          </i>{" "}
          for you to explore.
        </p>
        <h3>Getting started</h3>
        <p>Just login with your Google account.</p>
        <Button
          color="primary"
          size="large"
          variant="contained"
          style={{ marginTop: "1rem" }}
          onClick={props.loginHandler}
        >
          Get started
        </Button>
      </section>
      <section className={styles.textContent}>
        <hr style={{ marginTop: "2rem" }} />
        <h2>Achievements for educators</h2>
        <h3>Paths and path activities</h3>
        <p>Create your own paths and path activities to share with your students, friends and family.</p>
        <p className={styles.endingParagraph}>
          Choose from a wide range of options when creating your activities ie. from youtube / text to Jupyter notebooks
          problems.
        </p>
        <h3>Cohorts and courses</h3>
        <p>
          Anyone can also create courses to enroll students, assign problems for them to complete and track their
          progress.
        </p>
        <p className={styles.endingParagraph}>Use Cohorts to organise multiple courses.</p>
        <h3>Getting started</h3>
        <p>Login with your Google account to start educating on Achievements!</p>
        <Button
          color="primary"
          size="large"
          variant="outlined"
          style={{ marginTop: "1rem" }}
          onClick={props.loginHandler}
        >
          Get educating
        </Button>
      </section>
    </main>
  );
}
export default HomePage;
