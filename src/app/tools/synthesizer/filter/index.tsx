import { useMemo, useRef, useState } from "react";
import FilterNode from "@/audio/filter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import useElementSize from "@/hooks/use-element-size";
import {
  exponentialToLinear,
  linearToExponential,
  percentage,
} from "@/utils/math";
import FilterDisplay from "@/app/tools/synthesizer/filter/filter-display";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import CircularSlider from "@/components/ui/circular-slider";

const FILTER_FREQUENCY_MIN = 20;
const FILTER_FREQUENCY_MAX = 20000;

type Props = {
  filter: FilterNode;
};

const Filter = ({ filter }: Props) => {
  const [type, setType] = useState<BiquadFilterType>(filter.type);
  const [frequency, setFrequency] = useState(filter.frequency);
  const [bypass, setBypass] = useState(filter.bypass);

  const handleTypeChange = (type: BiquadFilterType) => {
    filter.type = type;
    setType(filter.type);
  };

  const handleFrequencyChange = (percentage: number) => {
    const exponentialFrequency = linearToExponential(
      percentage,
      FILTER_FREQUENCY_MIN,
      FILTER_FREQUENCY_MAX,
      0,
      100,
      3,
    );
    filter.frequency = exponentialFrequency;
    setFrequency(filter.frequency);
  };

  const handleBypassChange = (checked: boolean) => {
    filter.bypass = !checked;
    setBypass(filter.bypass);
  };

  const percentageFrequency = useMemo(
    () =>
      exponentialToLinear(
        frequency,
        FILTER_FREQUENCY_MIN,
        FILTER_FREQUENCY_MAX,
        0,
        100,
        3,
      ),
    [frequency],
  );

  const containerRef = useRef<HTMLDivElement | null>(null);

  const { width: containerWidth } = useElementSize(containerRef);

  return (
    <Card>
      <CardHeader className="flex-row justify-between">
        <h3 className="text-lg font-semibold">Filter</h3>
        <Switch checked={!bypass} onCheckedChange={handleBypassChange} />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Select value={type} onValueChange={handleTypeChange} disabled={bypass}>
          <SelectTrigger>
            <SelectValue placeholder="Select a Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="lowpass">Lowpass</SelectItem>
              <SelectItem value="highpass">Highpass</SelectItem>
              <SelectItem value="bandpass">Bandpass</SelectItem>
              <SelectItem value="notch">Notch</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div ref={containerRef}>
          <FilterDisplay
            width={containerWidth ?? 0}
            height={96}
            filterType={type}
            percentage={percentage(percentageFrequency, 0, 100)}
            disabled={bypass}
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p>Cutoff</p>
          <CircularSlider
            value={percentageFrequency}
            onChange={handleFrequencyChange}
            range={0.8}
            size={64}
            disabled={bypass}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Filter;
