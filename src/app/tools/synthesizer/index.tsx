import Delay from "@/app/tools/synthesizer/delay";
import Envelope from "@/app/tools/synthesizer/envelope";
import Filter from "@/app/tools/synthesizer/filter";
import Keys from "@/app/tools/synthesizer/keys";
import Lfo from "@/app/tools/synthesizer/lfo";
import Oscillator from "@/app/tools/synthesizer/oscillator";
import Reverb from "@/app/tools/synthesizer/reverb";
import DelayEffectNode, { DelayEffectNodeOptions } from "@/audio/delay";
import DistortionEffectNode from "@/audio/distortion";
import FilterNode, { FilterNodeSettings } from "@/audio/filter";
import LfoNode, { LfoNodeSettings } from "@/audio/lfo";
import PolyOscillator, {
  PolyOscillatorSettings,
} from "@/audio/poly-oscillator";
import ReverbEffectNode, { ReverbEffectNodeOptions } from "@/audio/reverb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAudioContext } from "@/contexts/audio";
import useMutable from "@/hooks/use-mutable";
import { cn } from "@/utils/styles";
import { useState } from "react";

const SETTINGS: {
  oscA: PolyOscillatorSettings;
  oscB: PolyOscillatorSettings;
  filter: FilterNodeSettings;
  lfo: LfoNodeSettings;
  reverb: ReverbEffectNodeOptions;
  delay: DelayEffectNodeOptions;
} = {
  oscA: { gain: 0.75 },
  oscB: { type: "triangle", gain: 0.5 },
  filter: { bypass: true },
  lfo: { amplitude: 0.25 },
  reverb: { decay: 1, mix: 0.25 },
  delay: { bypass: true },
};

const Synthesizer = () => {
  const audioContext = useAudioContext();

  const [tab, setTab] = useState("controls");

  const polyOscA = useMutable(new PolyOscillator(audioContext, SETTINGS.oscA));
  const polyOscB = useMutable(new PolyOscillator(audioContext, SETTINGS.oscB));
  const filterNode = useMutable(new FilterNode(audioContext, SETTINGS.filter));
  const lfoNode = useMutable(new LfoNode(audioContext, SETTINGS.lfo));
  const reverbNode = useMutable(
    new ReverbEffectNode(audioContext, SETTINGS.reverb),
  );
  const delayNode = useMutable(
    new DelayEffectNode(audioContext, SETTINGS.delay),
  );

  polyOscA.connect(filterNode);
  polyOscB.connect(filterNode);
  filterNode.connect(lfoNode);
  lfoNode.connect(reverbNode);
  reverbNode.connect(delayNode);
  delayNode.connect(audioContext.destination);

  return (
    <div className="container">
      <div className="flex flex-col items-center gap-8 py-[64px]">
        <h2 className="text-2xl font-semibold">Synthesizer</h2>
        <Tabs
          value={tab}
          onValueChange={(tab) => setTab(tab)}
          className="flex w-full flex-col items-center space-y-8"
        >
          <TabsList className="sticky top-10">
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="keyboard">Keyboard</TabsTrigger>
          </TabsList>
          <TabsContent value="controls" className="m-0 grid gap-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <Oscillator oscillator={polyOscA} />
              <Oscillator oscillator={polyOscB} />
            </div>
            <Envelope />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <Filter filter={filterNode} />
              <Lfo lfo={lfoNode} />
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <Reverb reverb={reverbNode} />
              <Delay delay={delayNode} />
            </div>
          </TabsContent>
          <TabsContent
            value="keyboard"
            className={cn("m-0 max-w-full", tab !== "keyboard" && "hidden")}
            forceMount
          >
            <Keys oscillators={[polyOscA, polyOscB]} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Synthesizer;
