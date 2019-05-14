/*
Notes:
This is a prototype of achievements homescreen.
Key features are:
- 3 categories of recommended activities (based on user's destinations, new things to try and activities to revisit)
- 2 types of activities - destination milestone activity (denoted by pin / footprint icons) and activity within destination (denoted by white or black circle icon)
- more information provided on mouseover of icons
Issues:
- carousel needs further work - especially if >2 cards, to fill up the empty space with to right of the 2 cards with the next card
- no props validation
*/
import React, { useState } from "react";
import Carousel from "nuka-carousel";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Popover from "@material-ui/core/Popover";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import "../../components/cards/css/NukaCarouselStyle.css";

function DisplayPopover(props) {
  const [anchorElement, setAnchorElement] = useState(null);
  const handleClick = event => {
    setAnchorElement(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorElement(null);
  };
  return (
    <span>
      <span
        onClick={handleClick}
        onMouseEnter={handleClick}
        onMouseLeave={handleClose}
        style={{ padding: "0px" }}
      >
        {props.children}
      </span>
      <Popover
        anchorEl={anchorElement}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        hideBackdrop={true}
        onClose={handleClose}
        open={Boolean(anchorElement)}
        style={{ pointerEvents: "none" }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        disableRestoreFocus
      >
        <Typography>{props.content}</Typography>
      </Popover>
    </span>
  );
}

function ChilliIcon() {
  return (
    <span aria-label="chilli" role="img">
      🌶️
    </span>
  );
}

function ClockIcon() {
  return (
    <span aria-label="clock" role="img">
      🕒
    </span>
  );
}

function AccomplishedDestinationIcon() {
  return (
    <span aria-label="whiteCircle" role="img">
      🐾
    </span>
  );
}

function IncompleteDestinationIcon() {
  return (
    <span aria-label="whiteCircle" role="img">
      📍
    </span>
  );
}

function UncompletedWhiteCircleIcon() {
  return (
    <span aria-label="whiteCircle" role="img">
      ⚪
    </span>
  );
}

function CompletedBlackCircleIcon() {
  return (
    <span aria-label="blackCircle" role="img">
      ⚫
    </span>
  );
}

function DifficultyComponent(props) {
  const difficultyIconArray = [];
  for (let i = 0; i < props.difficulty.difficultyLevel; i++) {
    difficultyIconArray.push(<ChilliIcon />);
  }
  return (
    <span>
      <DisplayPopover content={props.difficulty.difficultyText}>
        {difficultyIconArray}
      </DisplayPopover>
    </span>
  );
}

function DurationComponent(props) {
  const durationIconArray = [];
  for (let i = 0; i < props.duration.durationLevel; i++) {
    durationIconArray.push(<ClockIcon />);
  }
  return (
    <span>
      <DisplayPopover content={props.duration.durationText}>
        {durationIconArray}
      </DisplayPopover>
    </span>
  );
}

function CardComponent(props) {
  const {
    destinationIcon,
    title,
    description,
    destination,
    difficulty,
    duration
  } = props.data;
  return (
    <Card style={{ width: "400px", height: "250px" }}>
      <CardContent
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <Typography component="h2" gutterBottom variant="h6">
          <span style={{ marginRight: "10px" }}>
            <DisplayPopover content={destinationIcon.text}>
              {destinationIcon.icon}
            </DisplayPopover>
          </span>
          {title}
        </Typography>
        <Grid container>
          <Grid item xs={3}>
            <Typography
              component="p"
              style={{ color: "darkblue", marginBottom: "12px" }}
            >
              Description:
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography component="p" style={{ marginBottom: "12px" }}>
              {description}{" "}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography
              component="p"
              style={{ color: "maroon", marginBottom: "2vw" }}
            >
              Destination:
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <Typography component="p" style={{ marginBottom: "2vw" }}>
              {destination}
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={6}>
            <Typography component="p">
              <DifficultyComponent difficulty={difficulty} /> <br />
              <DurationComponent duration={duration} />
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <CardActions style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button color="primary" size="small" variant="contained">
                Try
              </Button>
            </CardActions>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function CarouselComponent(props) {
  return (
    <Paper style={{ backgroundColor: "#E5E4E2" }}>
      <Typography
        style={{
          backgroundColor: "#f7f4fa",
          padding: "0.5vw 2vw",
          boxShadow: "0 4px 2px -2px  rgba(128,128,128,0.3)"
        }}
        variant="h5"
      >
        {props.title}
      </Typography>
      <Carousel
        cellSpacing={20}
        className="customizeCarousel"
        renderCenterLeftControls={({ previousSlide }) => (
          <KeyboardArrowLeftIcon onClick={previousSlide} />
        )}
        renderCenterRightControls={({ nextSlide }) => (
          <KeyboardArrowRightIcon onClick={nextSlide} />
        )}
        slideWidth="400px"
        style={{ padding: "1.5vw", marginBottom: "3vh" }}
        wrapAround={true}
      >
        {props.children}
      </Carousel>
    </Paper>
  );
}

const data = [
  {
    title: "Recommended for your destinations",
    cards: [
      {
        content: {
          destinationIcon: {
            text: "Destination uncompleted",
            icon: <IncompleteDestinationIcon />
          },
          title: "Print Hello World in Python",
          description: "Apply the print function in Python",
          destination: "Building a basic Python program",
          difficulty: {
            difficultyLevel: 1,
            difficultyText: "This challenge is at your level"
          },
          duration: {
            durationLevel: 1,
            durationText: "This should take you about 3-6 minutes"
          }
        }
      }
    ]
  },
  {
    title: "Recommended for you to try",
    cards: [
      {
        content: {
          destinationIcon: {
            text: "Uncompleted activity",
            icon: <UncompletedWhiteCircleIcon />
          },
          title: "Loading data from strings",
          description: "Load data into your program from strings",
          destination: "Machine learning on sample data",
          difficulty: {
            difficultyLevel: 3,
            difficultyText:
              "This activity will test a lot of what you have learnt so far"
          },
          duration: {
            durationLevel: 3,
            durationText: "This should take you about 5-10 minutes"
          }
        }
      }
    ]
  },
  {
    title: "Recommended to revisit",
    cards: [
      {
        content: {
          destinationIcon: {
            text: "Destination accomplished!",
            icon: <AccomplishedDestinationIcon />
          },
          title: "Functions in Python",
          description: "Make your first function in Python",
          destination: "Design basic web server in Python",
          difficulty: {
            difficultyLevel: 3,
            difficultyText:
              "You should find this exercise to be smooth yet informative"
          },
          duration: {
            durationLevel: 3,
            durationText: "This should take you about 5-10 minutes"
          }
        }
      },
      {
        content: {
          destinationIcon: {
            text: "Activity completed!",
            icon: <CompletedBlackCircleIcon />
          },
          title: "Functions in Python 2",
          description: "Make your second function in Python",
          destination: "Design basic web server in Python",
          difficulty: {
            difficultyLevel: 4,
            difficultyText:
              "You might need to refer to external resources to solve this activity"
          },
          duration: {
            durationLevel: 4,
            durationText: "This should take you about 10-15 minutes"
          }
        }
      },
      {
        content: {
          destinationIcon: {
            text: "Activity completed!",
            icon: <CompletedBlackCircleIcon />
          },
          title: "Loop Function",
          description: "Practice on creating loops in Python",
          destination: "Design basic web server in Python",
          difficulty: {
            difficultyLevel: 5,
            difficultyText: "This activity is challenging."
          },
          duration: {
            durationLevel: 5,
            durationText: "This should take you about 30-60 minutes"
          }
        }
      }
    ]
  }
];

export default function HomeV3() {
  return (
    <div>
      {data.map(carousel => (
        <CarouselComponent key={carousel.title} title={carousel.title}>
          {carousel.cards.map(card => (
            <CardComponent data={card.content} key={card.content.title} />
          ))}
        </CarouselComponent>
      ))}
    </div>
  );
}
