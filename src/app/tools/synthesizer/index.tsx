import Delay from "@/app/tools/synthesizer/delay";
import Envelope from "@/app/tools/synthesizer/envelope";
import Filter from "@/app/tools/synthesizer/filter";
import Keys from "@/app/tools/synthesizer/keys";
import Lfo from "@/app/tools/synthesizer/lfo";
import Oscillator from "@/app/tools/synthesizer/oscillator";
import Reverb from "@/app/tools/synthesizer/reverb";
import DelayEffectNode from "@/audio/delay";
import DistortionEffectNode from "@/audio/distortion";
import FilterNode from "@/audio/filter";
import LfoNode from "@/audio/lfo";
import PolyOscillator from "@/audio/poly-oscillator";
import ReverbEffectNode from "@/audio/reverb";
import { useAudioContext } from "@/contexts/audio";
import useMutable from "@/hooks/use-mutable";

const Synthesizer = () => {
  const audioContext = useAudioContext();

  const polyOscA = useMutable(new PolyOscillator(audioContext));
  const polyOscB = useMutable(new PolyOscillator(audioContext));
  const filterNode = useMutable(new FilterNode(audioContext));
  const lfoNode = useMutable(new LfoNode(audioContext));
  const reverbNode = useMutable(new ReverbEffectNode(audioContext));
  const delayNode = useMutable(new DelayEffectNode(audioContext));
  const distortionNode = useMutable(new DistortionEffectNode(audioContext));

  polyOscA.connect(filterNode);
  polyOscB.connect(filterNode);
  filterNode.connect(lfoNode);
  lfoNode.connect(reverbNode);
  reverbNode.connect(delayNode);
  delayNode.connect(distortionNode);
  distortionNode.connect(audioContext.destination);

  return (
    <div className="container">
      <div className="flex flex-col items-center gap-8 py-[64px]">
        <h2 className="text-2xl font-semibold">Synthesizer</h2>
        <div className="grid gap-8">
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
        <div className="sticky bottom-0 bg-background w-full flex justify-center">
          <Keys oscillators={[polyOscA, polyOscB]} />
        </div>
      </div>
    </div>
  );
};

export default Synthesizer;
