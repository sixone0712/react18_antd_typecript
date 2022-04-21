import { blue } from '@ant-design/colors';
import { css } from '@emotion/react';
import { Modal, Tooltip } from 'antd';
import React, { useMemo } from 'react';
import Yallist from 'yallist';
import { RemoteJobStepMilestone } from '../../../../types/Job';
import { convertStepType } from '../../RemoteJob/Drawer/RemoteJobStepsDrawerCommon';

export type StepMilestoneModalProps = {
  steps: RemoteJobStepMilestone[] | undefined;
  visible: boolean;
  setVisible: (value: boolean) => void;
};

export default React.memo(function StepMilestoneModal({
  steps,
  visible,
  setVisible,
}: StepMilestoneModalProps): JSX.Element {
  const stepMilestone = useMemo(() => (visible ? makeStepMilestone(steps ?? []) : []), [steps, visible]);
  const uuidStepName = useMemo(() => {
    return visible
      ? steps?.reduce((map, obj) => {
          map.set(obj.uuid as string, obj.stepName);
          return map;
        }, new Map<string, string | null>()) ?? new Map<string, string | null>()
      : new Map<string, string | null>();
  }, [steps, visible]);

  return (
    <Modal
      title={'Steps Milestone'}
      visible={visible}
      onOk={() => setVisible(false)}
      okText="Close"
      cancelButtonProps={{
        hidden: true,
      }}
      closable
      onCancel={() => setVisible(false)}
      maskClosable
      destroyOnClose
      width={'1000px'}
    >
      <div css={style}>
        {stepMilestone.map((item, idx) => (
          <div className="milestone" key={idx}>
            <div className="start-icon">🔖</div>
            <div className="step-area">
              {item.map((step, idx) => (
                <div className="step" key={idx}>
                  <StepMileStoneItem step={step} isLast={Boolean(idx >= item.length - 1)} uuidStepName={uuidStepName} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
});

const StepMileStoneItem = React.memo(function MileStoneItemMemo({
  step,
  isLast,
  uuidStepName,
}: {
  step: RemoteJobStepMilestone;
  isLast: boolean;
  uuidStepName: Map<string, string | null>;
}) {
  const renderTitle = useMemo(() => {
    let title: React.ReactNode;

    switch (step.mode) {
      case 'time':
        title = step.time ? (
          <div>
            <div>[Specified Time]</div>
            <>
              {step.time.map((item) => (
                <div key={item}>{item}</div>
              ))}
            </>
          </div>
        ) : null;
        break;
      case 'cycle':
        title =
          (
            <div>
              <div>[Cycle]</div>
              <div>{`${step.period} ${step.cycle}`}</div>
            </div>
          ) ?? null;
        break;
      case 'pre':
        title = (
          <div>
            <div>[Previous]</div>
            <div>{uuidStepName.get(step.preStep as string) ?? 'No Value'}</div>
          </div>
        );
        break;
      case 'next':
        title = (
          <div>
            <div>[Next]</div>
            <div>{uuidStepName.get(step.nextStep as string) ?? 'No Value'}</div>
          </div>
        );
        break;
      case 'none':
        title = '[None]';
        break;
      default:
        break;
    }

    return title;
  }, [step, uuidStepName]);

  return (
    <Tooltip placement="top" title={renderTitle}>
      <div css={stepItemStyle({ enable: step.enable, isLast })}>
        <div className="step-name">{`${step.stepName} (${convertStepType(step.stepType)})`}</div>
        <div className="step-arrow">{`${isLast ? '' : '→'}`}</div>
      </div>
    </Tooltip>
  );
});

const style = css`
  max-height: 35rem;
  overflow-y: auto;
  .milestone {
    display: flex;
    &:not(:last-of-type) {
      margin-bottom: 0.5rem;
    }
    .start-icon {
      margin-right: 0.5rem;
    }
    .step-area {
      display: flex;
      flex-wrap: wrap;
    }
  }
`;

const stepItemStyle = ({ enable, isLast }: { enable: boolean; isLast: boolean }) => css`
  cursor: default;
  display: flex;
  .step-name {
    &:hover {
      color: ${enable ? blue[4] : 'gray'};
    }
    color: ${!enable && 'rgba(0, 0, 0, 0.45)'};
  }
  ${!isLast &&
  css`
    .step-arrow {
      margin-left: 0.5rem;
      margin-right: 0.5rem;
    }
  `}
`;

const makeStepMilestoneNode = (steps: RemoteJobStepMilestone[]): Yallist<RemoteJobStepMilestone>[] => {
  const linkedList: Yallist<RemoteJobStepMilestone>[] = [];
  steps.forEach((step) => {
    const curNode = Yallist.create([step]);

    const findPreStep = step.preStep ? steps.find((item) => item.uuid === step.preStep) : undefined;
    if (findPreStep) {
      curNode.unshift(findPreStep);
    }

    let isNew = true;
    linkedList.forEach((item, index) => {
      if (curNode.head?.value.uuid === item.tail?.value.uuid) {
        // The head of the current node is the tail of another node.
        curNode.shift(); // remote the head of the current node for pushing existing node
        curNode.toArray().forEach((item) => {
          linkedList[index].push(item);
        });
        isNew = false;
        return;
      } else if (curNode.tail?.value.uuid === item.head?.value.uuid) {
        // The tail of the current node is the head of another node.
        curNode.pop(); // remote the head of the current node for unshifting existing node
        curNode.toArrayReverse().forEach((item) => {
          linkedList[index].unshift(item);
        });

        isNew = false;
        return;
      }
    });

    if (isNew) {
      linkedList.push(curNode);
    }
  });

  return linkedList;
};

const trimStepMilestoneNode = (linkedList: Yallist<RemoteJobStepMilestone>[]): Yallist<RemoteJobStepMilestone>[] => {
  const trimLinkedList: Yallist<RemoteJobStepMilestone>[] = [];
  linkedList.forEach((curNode) => {
    let isNew = true;
    const newCurNode = Yallist.create([...curNode.toArray()]); // Create a new node to prevent data changes
    trimLinkedList.forEach((item, index) => {
      if (newCurNode.head?.value.uuid === item.tail?.value.uuid) {
        // The head of the current node is the tail of another node.
        newCurNode.shift(); // remote the head of the current node for pushing existing node
        newCurNode.toArray().forEach((item) => {
          trimLinkedList[index].push(item);
        });
        isNew = false;
        return;
      }
    });
    if (isNew) {
      trimLinkedList.push(newCurNode);
    }
  });

  return trimLinkedList;
};

const makeStepMilestone = (steps: RemoteJobStepMilestone[]) => {
  const linkedList = makeStepMilestoneNode(steps);
  return trimStepMilestoneNode(linkedList).map((item) => item.toArray());
};
