import { useEffect, useState } from "react";

interface CountdownTimerProps {
  purchaseClosedAt: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  purchaseClosedAt,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    if (!purchaseClosedAt) return;

    const calculateTimeLeft = () => {
      const end = new Date(purchaseClosedAt).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        expired: false,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [purchaseClosedAt]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("pt-BR") +
      " " +
      date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="text-center flex-1">
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg py-2 px-1 mx-0.5">
        <div className="font-bold text-primary text-lg md:text-xl tracking-tight font-mono">
          {value.toString().padStart(2, "0")}
        </div>
      </div>
      <div className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-wide">
        {label}
      </div>
    </div>
  );

  if (!purchaseClosedAt) return null;

  return (
    <div className="text-center">
      <p className="text-primary font-semibold text-sm uppercase tracking-wide mb-3">
        Encerramento das Vendas
      </p>
      <div className="flex items-stretch justify-between gap-0.5 mb-2">
        {timeLeft.days > 0 && (
          <>
            <TimeUnit value={timeLeft.days} label="dias" />
            <div className="flex items-center justify-center">
              <div className="w-0.5 h-0.5 bg-primary/30 rounded-full"></div>
            </div>
          </>
        )}
        <TimeUnit value={timeLeft.hours} label="horas" />
        <div className="flex items-center justify-center">
          <div className="w-0.5 h-0.5 bg-primary/30 rounded-full"></div>
        </div>
        <TimeUnit value={timeLeft.minutes} label="min" />
        <div className="flex items-center justify-center">
          <div className="w-0.5 h-0.5 bg-primary/30 rounded-full"></div>
        </div>
        <TimeUnit value={timeLeft.seconds} label="seg" />
      </div>
      <p className="text-primary font-semibold text-sm">
        Até {formatDateTime(purchaseClosedAt)}
      </p>
    </div>
  );
};
