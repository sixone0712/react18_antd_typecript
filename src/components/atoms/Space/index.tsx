import styled from '@emotion/styled';

export const V_SPACE = styled.div<{ rem?: number }>`
  height: ${({ rem }) => (rem ? `${rem}rem` : '1rem')};
`;

export const H_SPACE = styled.div<{ rem?: number }>`
  width: ${({ rem }) => (rem ? `${rem}rem` : '1rem')};
`;
