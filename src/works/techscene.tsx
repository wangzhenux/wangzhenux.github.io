import * as React from "react";
import Spinning from "../components/Spinning";
import { Typography, Grid } from "@mui/material";
import WorkBodyText from "../components/WorkBodyText";
import WorkH1 from "../components/WorkH1";
import WorkHeader from "../components/WorkHeader";
import WorkSection from "../components/WorkSection";
import { WORKBEM } from "../components/WorkWithDetails";
import WorkImage from "../components/WorkImage";
import WorkHighlight from "../components/WorkHighlight";
import WorkH2 from "../components/WorkH2";
import WorkCard from "../components/WorkCard";

export interface TechSceneProps {}

class TechScene extends React.Component<TechSceneProps> {
  render() {
    return (
      <Spinning>
        <div className={WORKBEM.block("techscene")}>
          <WorkHeader
            style={{
              backgroundImage:
                "linear-gradient(to right bottom, #1d2b40, #192c47, #142c4f, #102c56, #0b2c5d)",
            }}
            logo={<img src="techscene/logo.svg" alt="techscene logo" />}
            subtitle="TechScene is an online event site dedicated to providing
        event listings specific to technology and the tech industry
        of Austin, Texas."
            roles="Team Co-leader • Interaction Designer • User Researcher"
            practices="Interaction Design • Wireframe • User Research • Usability Testing • Rapid Prototyping"
            headerImage={
              <WorkImage
                src="techscene/techScene-homepage.png"
                title="TechScene Homepage"
              />
            }
          />
          <WorkSection>
            <WorkImage
              src="techscene/process_flow_chart.png"
              title="TechScene Process"
              spaced={true}
            />
          </WorkSection>
          <WorkSection style={{ background: "#f1f1f1" }}>
            <WorkH1>Initial Concept Discussion</WorkH1>
            <WorkBodyText>
              <b>Define opportunity space</b>: there are other event sites
              within the greater Austin community but they are more broadly
              focused. The creators of TechScene, after wading through multiple
              meetup and event sites, became fatigued trying to locate a
              centrally focused site proving the types of events, activities,
              meetups, classes/learning opportunities, social and networking
              get-togethers they wished to attend.
            </WorkBodyText>
            <WorkBodyText>
              Thus, the idea was born to create a site dedicated to the
              TechScene in Austin, Texas to meet those needs by{" "}
              <WorkHighlight>
                listing happenings and opportunities to connect, network, learn,
                collaborate, play and socialize
              </WorkHighlight>
              . TechScene would provide like-minded users a manageable, central
              location to access key information on the local tech events,
              eliminating the extraneous listings that are not the intended
              objectives of students, enthusiasts and professionals.
            </WorkBodyText>
          </WorkSection>
          <WorkSection>
            <WorkH1>User Research</WorkH1>
            <WorkH2>Interview Phase 1</WorkH2>
            <WorkBodyText>
              In this interview phase,{" "}
              <WorkHighlight>
                6 people were interviewed in ages ranging from 22 to 35
              </WorkHighlight>
              . Interview questions were designed to gather information on the
              interviewee’s experience with tech events, current search process
              and what they would like to see on a tech event website.
            </WorkBodyText>
            <WorkH2 space>Competitive Analysis</WorkH2>
            <WorkBodyText>
              After the initial round of interviews, a competitive analysis was
              conducted on 6 websites identified by interviewees and team
              members in their current search process. These websites included
              Meetup, Eventbrite, Do512, SXSW and Technical.ly. Team members
              summarized the mission of each website and{" "}
              <WorkHighlight>
                analyzed strengths and weaknesses in their overall design,
                search functionality, and overall categorization scheme for
                events
              </WorkHighlight>
              .
            </WorkBodyText>
            <WorkBodyText>
              Through the appraisal of these competitive sites, key features
              were selected for further analysis of strengths and weaknesses.
              This investigation allowed for the adoption and improvement of
              select elements within the TechScene platform.
            </WorkBodyText>
            <WorkImage
              src="techscene/competitive_analysis.png"
              title="TechScene Competitive Analysis"
              spaced={true}
            />
            <WorkH2 space>Interview Phase 2</WorkH2>
            <WorkBodyText>
              In this second interview phase,{" "}
              <WorkHighlight>
                4 people were interviewed ranging in age from 22 - 60
              </WorkHighlight>
              . In the first round of interviews, respondents were primarily
              female students. In order to balance the gender distribution of
              the interviewees, we recruited more male respondents in the second
              round of interviews. The occupations of these respondents included{" "}
              <WorkHighlight>
                an educational instructor, a professor and 2 employees working
                in a tech-related field
              </WorkHighlight>
              .
            </WorkBodyText>
            <div className={WORKBEM.element("cards")}>
              <WorkCard
                avatar="1"
                title="Interviewee 1"
                subheader="University Student"
                content={
                  <div className={WORKBEM.element("quotes")}>
                    I really care about the time the event or the conference is
                    going to take. Also, I would like to know how I can get
                    there. Besides, I want to go with my friends. So before I
                    decide to go to any event, I will ask my friends if anyone
                    wants to attend as well.
                  </div>
                }
              />
              <WorkCard
                avatar="2"
                title="Interviewee 2"
                subheader="University Professor"
                content={
                  <div className={WORKBEM.element("quotes")}>
                    As an university professor, I’d like to socialize with
                    people in my field, not only from school but also industry.
                    By talking with professors from other school, I can compare
                    the way of teaching, and learn what I miss when I am
                    teaching. By communicating with people from industry, I
                    learn what skills my students should have. Besides, I also
                    want to find job or intern opportunity for my students.
                  </div>
                }
              />
              <WorkCard
                avatar="3"
                title="Interviewee 3"
                subheader="Tech-related Field Employee"
                content={
                  <div className={WORKBEM.element("quotes")}>
                    I’d like to meet people also work in the tech-related field.
                    So we can share our experience. For current exist tech event
                    website, I really like some functions like importing events
                    to my own calendar.
                  </div>
                }
              />
              <WorkCard
                avatar="4"
                title="Interviewee 4"
                subheader="Tech-related Field Employee"
                content={
                  <div className={WORKBEM.element("quotes")}>
                    I’d like to attend events that are related to my current job
                    field. Some basic things I want to know include speakers’
                    background, the topic of the speech, structure of the event
                    and the host of the event. Also, I wish I can synchronize
                    with my own calendar and personalization toward an
                    individual needs.
                  </div>
                }
              />
            </div>
            <WorkH2 space>Surveys</WorkH2>
            <WorkBodyText>
              We launched a survey created in Qualtrics through the iSchool’s
              Insider in order to accumulate more user information to assist in
              site development. Survey links were additionally sent to a
              selection of the tech industry community that was associated with
              team members. The survey was comprised of 13 questions, which
              assessed demographic information, experience with tech events and
              desired content for a tech event website.
            </WorkBodyText>
            <WorkImage
              src="techscene/survey_results.png"
              title="Survey Results"
              spaced={true}
            />
          </WorkSection>
          <WorkSection>
            <WorkH1>Concept Ideation</WorkH1>
            <WorkBodyText>
              In our group’s initial stage of site design, we used an affinity
              diagram method to identify necessary site areas and their location
              on the site. In this process, each team member read through the
              interview and survey results and then created a post-it note for
              each relevant site area. Each team member then placed these
              post-it notes in their own arrangement of related categories and
              topics. Following each team member going through this process, we
              consolidated elements of our individual mappings together.
            </WorkBodyText>
            <WorkBodyText>
              After synthesizing our findings, we came up with personas and
              storyboards. Also, our group created a rough design for the site’s
              overarching categories, global navigation, homepage, event detail
              page, personal settings page and event creation page.
            </WorkBodyText>
          </WorkSection>
          <WorkSection style={{ background: "#f5f5f5" }}>
            <Typography
              variant="caption"
              display="block"
              align="center"
              gutterBottom
            >
              Affinity Diagram
            </Typography>
            <WorkImage
              src="techscene/affinity_diagram.png"
              title="Affinity Diagram"
              spaced
            />

            <Typography
              variant="caption"
              display="block"
              align="center"
              gutterBottom
            >
              Persona
            </Typography>
            <WorkImage src="techscene/personas.png" title="Personas" spaced />

            <Typography
              variant="caption"
              display="block"
              align="center"
              gutterBottom
            >
              Information Architecture Initial Ideation
            </Typography>
            <WorkImage
              src="techscene/information_architecture_initial_ideation.png"
              title="Information Architecture Initial Ideation"
              spaced
            />
          </WorkSection>
          <WorkSection>
            <WorkH1>Iterative Design</WorkH1>
            <WorkBodyText>
              We discussed and determined the initial blueprint. Then we began
              with paper prototypes, drafting out the chosen design idea, which
              was supposed to show a flow of the main functions of our website.
              We gathered usability feedback from usability testing and iterated{" "}
              <WorkHighlight>5 rounds of the prototype</WorkHighlight> from the
              early sketch to hi-fidelity mockups. Each iteration, we refined
              our ideas and design. Meanwhile along with the design, we also
              settled down the Content Mapping and Controlled Vocabulary.
            </WorkBodyText>
            <WorkH2 space>Wireframes</WorkH2>
            <WorkBodyText>
              Wireframes created in Balsamiq and Axure were used to design early
              versions of the TechScene homepage, search results page, event
              detail page, account page and create event process. Designs
              initially sketched on paper were mocked up in these design
              software programs, which allowed us to rapidly prototype the
              website. From testing the wireframes, we gathered valuable
              comments on the feedback towards the information architecture.
            </WorkBodyText>
            <WorkH2 space>Usability Testing</WorkH2>
            <WorkBodyText>
              For each prototype, we performed usability testing. From paper
              prototype to hi-fidelity prototype, we gained a lot of great
              feedbacks. Based off of feedback we received from each round of
              usability testing, we made modifications on the pages that may
              influence user’s experience. In total,{" "}
              <WorkHighlight>
                15 participants were used across 25 user testing sessions
                carried out for this project
              </WorkHighlight>
              .
            </WorkBodyText>
            <WorkImage
              src="techscene/usability_testing.png"
              title="Usability Testing"
            />
            <WorkH2 space>High Fidelity Mockup</WorkH2>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <WorkBodyText>
                  For the hi-fidelity prototype, we focused on the TechScene’s
                  brand identity including color, typography, images, icon, grid
                  system, as well as some of the interaction standards included
                  on the site. Based on the guide, the designers and developers
                  have a standard reference point for conducting site design.
                </WorkBodyText>
              </Grid>
              <Grid item xs={12} sm={6}>
                <WorkImage
                  src="techscene/hi_fidelity_mockup.png"
                  title="Hi-fidelity Mockup"
                />
              </Grid>
            </Grid>
          </WorkSection>
          <WorkSection
            style={{
              backgroundColor: "rgba(16, 44, 87, 0.2)",
            }}
            className="grid-blueprint"
          >
            <WorkImage
              src="techscene/homepage_design_iteration.png"
              title="Homepage Design Iterations"
              isZoomable
              spaced
            />
            <WorkImage
              src="techscene/search_result_page_design_iteration.png"
              title="Search Result Page Design Interactions"
              isZoomable
              spaced
            />
            <WorkImage
              src="techscene/event_detail_page_design_iteration.png"
              title="Event Detail Page Design Iterations"
              isZoomable
              spaced
            />
            <WorkImage
              src="techscene/create_event_page_design_iteration.png"
              title="Create Event Page Design Iterations"
              isZoomable
              spaced
            />
            <WorkImage
              src="techscene/account_page_design_iteration.png"
              title="Account Page Design Iterations"
              isZoomable
              spaced
            />
          </WorkSection>
        </div>
      </Spinning>
    );
  }
}

export default TechScene;
