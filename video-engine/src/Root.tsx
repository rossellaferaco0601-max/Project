import { Composition } from "remotion";
import { FORMATS } from "./lib/formats";
import { CNReel, reelDuration } from "./cn/CNReel";
import { REELS } from "./cn/reels51";
import { CNCover } from "./cn/CNCover";
import { CNCoverCollage } from "./cn/CNCoverCollage";
import { CNLong, longDuration } from "./cn/CNLong";
import { LONGS } from "./cn/long";
import { RSReel, rsDuration } from "./rs/RSReel";
import rsDemo from "./rs/demo.json";

const reel = FORMATS.reel;

export const RemotionRoot: React.FC = () => (
  <>
    {REELS.map((r) => (
      <Composition key={r.id} id={r.id} component={CNReel} durationInFrames={reelDuration(r.props)} {...reel} defaultProps={r.props} />
    ))}
    {/* copertine: stesso formato per tutti i reel che hanno `cover` (id del reel + «-copertina»). Composition a 30 fps e non Still (che va a 1 fps): così `frame` è il fotogramma del master */}
    {REELS.filter((r) => r.cover).map((r) => (

      <Composition key={`${r.id}-copertina`} id={`${r.id}-copertina`} component={CNCover} width={1080} height={1920} fps={30} durationInFrames={1} defaultProps={{ ...r.cover!, master: (r.cover!.master ?? r.props.master).replace("_fx.mp4", ".mp4").replace("C6-metronomo-manuale", "C6-metronomo"), frame: r.cover!.frame ?? 60 }} />
    ))}
    {/* copertina del vlog lungo del workshop (Ross 19/11): il vlog è fatto in ReelStudio, qui ci sono solo i fotogrammi del video finito (public/evento/tiles), in collage dietro un riquadro crema */}
    <Composition id="VLOG-workshop-copertina" component={CNCoverCollage} width={1080} height={1920} fps={30} durationInFrames={1} defaultProps={{ tiles: ["evento/tiles/00.jpg", "evento/tiles/01.jpg", "evento/tiles/02.jpg", "evento/tiles/03.jpg", "evento/tiles/04.jpg", "evento/tiles/05.jpg", "evento/tiles/06.jpg", "evento/tiles/07.jpg", "evento/tiles/08.jpg", "evento/tiles/09.jpg", "evento/tiles/10.jpg", "evento/tiles/11.jpg", "evento/tiles/12.jpg", "evento/tiles/13.jpg", "evento/tiles/14.jpg", "evento/tiles/15.jpg", "evento/tiles/16.jpg", "evento/tiles/17.jpg", "evento/tiles/18.jpg", "evento/tiles/19.jpg", "evento/tiles/20.jpg", "evento/tiles/21.jpg", "evento/tiles/22.jpg", "evento/tiles/23.jpg", "evento/tiles/24.jpg"], cols: 5, kicker: "Dal vivo", lines: ["Una giornata", "di workshop"], accent: "workshop" }} />
    {LONGS.map((r) => (
      <Composition key={r.id} id={r.id} component={CNLong} durationInFrames={longDuration(r.props)} width={1920} height={1080} fps={30} defaultProps={r.props} />
    ))}
    {/* Motore ReelStudio (project.json del PC): props = scripts/rs_props.ts */}
    <Composition
      id="RSReel"
      component={RSReel}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={150}
      defaultProps={rsDemo as any}
      calculateMetadata={({ props }: any) => ({ durationInFrames: rsDuration(props), fps: props.fps || 30 })}
    />
  </>
);
