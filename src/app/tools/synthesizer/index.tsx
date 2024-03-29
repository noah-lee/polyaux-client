import Delay from "@/app/tools/synthesizer/delay";
import Envelope from "@/app/tools/synthesizer/envelope";
import Filter from "@/app/tools/synthesizer/filter";
import Keys from "@/app/tools/synthesizer/keys";
import Lfo from "@/app/tools/synthesizer/lfo";
import Oscillator from "@/app/tools/synthesizer/oscillator";
import Reverb from "@/app/tools/synthesizer/reverb";
import DelayEffectNode, { DelayEffectNodeOptions } from "@/audio/delay";
import FilterNode, { FilterNodeSettings } from "@/audio/filter";
import LfoNode, { LfoNodeSettings } from "@/audio/lfo";
import PolyOscillator, {
  PolyOscillatorSettings,
} from "@/audio/poly-oscillator";
import ReverbEffectNode, { ReverbEffectNodeOptions } from "@/audio/reverb";
import { useAudioContext } from "@/contexts/audio";
import useMutable from "@/hooks/use-mutable";

const SETTINGS: {
  oscA: PolyOscillatorSettings;
  oscB: PolyOscillatorSettings;
  filter: FilterNodeSettings;
  lfo: LfoNodeSettings;
  reverb: ReverbEffectNodeOptions;
  delay: DelayEffectNodeOptions;
} = {
  oscA: { gain: 0.75 },
  oscB: { type: "triangle", gain: 0.35, octave: 1 },
  filter: { bypass: true },
  lfo: { amplitude: 0.4 },
  reverb: { decay: 1, mix: 0.3 },
  delay: { mix: 0.3 },
};

const Synthesizer = () => {
  const audioContext = useAudioContext();
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
        <div className="sticky top-[72px] z-10 max-w-full">
          <Keys oscillators={[polyOscA, polyOscB]} />
        </div>
        <div className="m-0 grid gap-8">
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
        </div>
      </div>
    </div>
  );
};

export default Synthesizer;
