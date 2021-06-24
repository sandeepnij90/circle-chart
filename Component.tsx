import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { Styles } from '@integrate/hedgehogger';

interface SizeProps {
	size?: number;
	width?: string;
}

interface WrapperProps {
	width?: string;
	height?: string;
	minWidth?: string;
	minHeight?: string;
}

const Wrapper = styled.div<WrapperProps>`
	display: grid;
	justify-content: center;
	justify-items: center;
	width: ${({ width }) => width || 'auto'};
	height: ${({ height }) => height || 'auto'};
	min-width: ${({ minWidth }) => minWidth || '200px'};
	min-height: ${({ minHeight }) => minHeight || '0'};
`;

const Figure = styled.figure<SizeProps>`
	${({ size }) =>
		size &&
		css`
			width: ${size}px;
			height: ${size}px;
		`}
	min-width: 200px;
	min-height: 200px;
	position: relative;
	margin: 0;
`;

const FigCaption = styled.figcaption<SizeProps>`
	width: ${({ width }) => `${width}` || 'auto'};
	margin: auto;
`;

interface Data {
	value: number;
	label: string;
	color: string;
	action?: () => void;
	id: string;
}
interface IProps {
	width?: string;
	height?: string;
	minWidth?: string;
	minHeight?: string;
	data: Data[];
	mainText: string;
	subText?: string;
	circleSize?: number;
	dataTestId?: string;
}

const TextWrapper = styled.div<SizeProps>`
	font-family: ${Styles.fonts.primary};
	display: grid;
	align-content: center;
	justify-content: center;
	${({ size }) =>
		size &&
		css`
			width: ${size * 0.6}px;
			height: ${size * 0.6}px;
		`}
	text-align: center;
	row-gap: 8px;
`;

const MainText = styled.span`
	display: block;
	font-size: ${Styles.fontSizes.l1};
	color: ${Styles.colors.neutral900};
`;
const SubText = styled.span`
	display: block;
	font-size: ${Styles.fontSizes.s3};
	color: ${Styles.colors.coolNeutral700};
`;

const InnerCircle = styled.div<SizeProps>`
	${({ size }) =>
		size &&
		css`
			width: ${size * 0.6}px;
			height: ${size * 0.6}px;
		`}
	position: absolute;
	border-radius: 50%;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	margin: auto;
	box-shadow: 0 0 30px ${Styles.colors.black}${Styles.colors.opacity10};
`;

interface KeyProps {
	hasAction: boolean;
}

const KeyWrapper = styled.ul`
	list-style: none;
	padding: 0;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
`;

const Key = styled.li<KeyProps>`
	font-family: ${Styles.fonts.primary};
	color: ${Styles.colors.neutral500};
	padding: 4px 8px;
	color: ${Styles.colors.neutral500};
	transition: 0.2s;
	${({ hasAction }) =>
		hasAction &&
		css`
			text-decoration: underline;
			cursor: pointer;
			&:hover {
				color: ${Styles.colors.neutral900};
			}
		`}
`;

interface KeyCircleProps {
	color: string;
}

const KeyCircle = styled.span<KeyCircleProps>`
	width: 10px;
	height: 10px;
	border-radius: 50%;
	display: inline-block;
	margin-right: 8px;
	${({ color }) =>
		color &&
		css`
			background-color: ${color};
		`}
`;

export const CircleChart: FC<IProps> = ({
	width,
	minWidth,
	height,
	minHeight,
	mainText,
	subText,
	circleSize = 200,
	dataTestId = 'circleChart',
	data,
}) => {
	const radius = '15.91549430918954';
	const centerPosition = '21';
	const formattedSize = circleSize < 200 ? 200 : circleSize;

	const generateCircles = () => {
		const total = data.reduce((acc, val) => val.value + acc, 0);
		return data.map(({ value, color, label, id }, index) => {
			const defaultOffset = 25;
			const percentage = (value / total) * 100;
			const remaining = 100 - percentage;
			const strokeArr = `${percentage} ${remaining}`;

			const calculateOffset = () => {
				const totalPercent = data.reduce((acc, val, i) => {
					if (i < index) {
						const perc = (val.value / total) * 100;
						return acc + perc;
					}
					return acc;
				}, 0);

				return 100 - totalPercent + 25;
			};

			const offset = index === 0 ? defaultOffset : calculateOffset();

			return (
				<circle
					data-testid={`segment-${id}`}
					cx={centerPosition}
					key={id}
					cy={centerPosition}
					r={radius}
					fill="transparent"
					stroke={color}
					strokeWidth="2"
					strokeDasharray={strokeArr}
					strokeDashoffset={offset}
				>
					<desc>{`${label} taking up ${percentage}% of chart`}</desc>
				</circle>
			);
		});
	};

	const renderKeys = () => {
		return data.map(({ label, action, color, id }) => {
			return (
				<Key key={id} onClick={action} hasAction={!!action} data-testid={`key-${id}`}>
					<KeyCircle color={color} data-testid={`key-${id}-circle`} />
					{label}
				</Key>
			);
		});
	};

	return (
		<Wrapper width={width} height={height} minWidth={minWidth} minHeight={minHeight} data-testid={dataTestId}>
			<Figure size={formattedSize}>
				<InnerCircle size={formattedSize} data-testid="inner-circle">
					<TextWrapper size={formattedSize}>
						<MainText>{mainText}</MainText>
						<SubText>{subText}</SubText>
					</TextWrapper>
				</InnerCircle>
				<svg width="100%" height="100%" viewBox="0 0 42 42">
					{generateCircles()}
				</svg>
			</Figure>
			<FigCaption width={width}>
				<KeyWrapper>{renderKeys()}</KeyWrapper>
			</FigCaption>
		</Wrapper>
	);
};
