import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper, { Step } from '@/components/Stepper';
import { markRegistered } from '@/lib/auth';
import nameText from '../../name.txt?raw';

function parseNames(text: string): string[] {
  return text
    .split(/\s+/)
    .map((n) => n.trim())
    .filter(Boolean);
}

function normalizeClass(input: string): string {
  return input.replace(/班$/, '').trim();
}

export default function Checking() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [classInput, setClassInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [error, setError] = useState('');

  const names = useMemo(() => parseNames(nameText), []);

  const normalizedClass = normalizeClass(classInput);
  const isClass15 = normalizedClass === '15';
  const isNameValid = names.includes(nameInput.trim());
  const isSuccess = isClass15 && isNameValid;

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!classInput.trim()) {
        setError('请填写班级');
        return;
      }
      setError('');
      setStep(3);
      return;
    }

    if (step === 3) {
      if (!nameInput.trim()) {
        setError('请填写姓名');
        return;
      }
      setError('');
      setStep(4);
      return;
    }

    if (step === 4) {
      if (isSuccess) {
        markRegistered(nameInput.trim());
        navigate('/teachers');
      } else {
        setClassInput('');
        setNameInput('');
        setError('');
        setStep(1);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  const failureReason = (() => {
    if (!isClass15) return '你所在的班级不是15班';
    if (!isNameValid) return '姓名不在名单内';
    return '';
  })();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] px-4 py-20 text-white">
      <Stepper
        currentStep={step}
        disableStepIndicators
        backButtonText="上一步"
        nextButtonText="下一步"
        completeButtonText={isSuccess ? '开始' : '重新注册'}
        backButtonProps={{ onClick: handleBack }}
        nextButtonProps={{ onClick: handleNext }}
        stepCircleContainerClassName="border-white/10 bg-white/5 backdrop-blur-xl"
        contentClassName="text-white"
      >
        <Step>
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-semibold">欢迎注册 回忆</h2>
            <p className="text-white/70">请完成以下验证，加入我们的回忆。</p>
          </div>
        </Step>

        <Step>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">请输入你高中所在的班级</h2>
            <input
              type="text"
              value={classInput}
              onChange={(e) => {
                setClassInput(e.target.value);
                if (error) setError('');
              }}
              placeholder="例如：15班"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-[#5227FF] focus:outline-none"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        </Step>

        <Step>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">请输入您的姓名</h2>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (error) setError('');
              }}
              placeholder="你的姓名"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-[#5227FF] focus:outline-none"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
        </Step>

        <Step>
          <div className="text-center">
            {isSuccess ? (
              <>
                <h2 className="mb-2 text-2xl font-semibold text-green-400">注册成功</h2>
                <p className="text-white/80">
                  欢迎回来，<span className="font-semibold text-white">{nameInput.trim()}</span>。
                </p>
              </>
            ) : (
              <>
                <h2 className="mb-2 text-2xl font-semibold text-red-400">我不认识你</h2>
                <p className="text-white/80">注册失败，抱歉。</p>
                <p className="mt-2 text-sm text-white/60">具体原因：{failureReason}</p>
              </>
            )}
          </div>
        </Step>
      </Stepper>
    </main>
  );
}
