import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CircleChart } from '../CircleChart';

afterEach(cleanup);

const data = [
	{
		id: '1',
		label: 'first segment',
		value: 5,
		color: 'blue',
	},
	{
		id: '2',
		label: 'second segment',
		value: 5,
		color: 'red',
	},
];

test('Should have a default test id', () => {
	const { getByTestId } = render(<CircleChart data={data} mainText="main text" />);
	expect(getByTestId('circleChart')).toBeInTheDocument();
});

test('Should have a custom test id', () => {
	const { getByTestId } = render(<CircleChart data={data} dataTestId="customCircleChart" mainText="main text" />);
	expect(getByTestId('customCircleChart')).toBeInTheDocument();
});

test('Should render segments from data', () => {
	const { getByTestId } = render(<CircleChart data={data} mainText="main text" />);
	expect(getByTestId('segment-1')).toBeInTheDocument();
	expect(getByTestId('segment-2')).toBeInTheDocument();
});

test('Should calculate percentage for each segment', () => {
	const { getByTestId } = render(<CircleChart data={data} mainText="main text" />);
	expect(getByTestId('segment-2').querySelector('desc')).toHaveTextContent('second segment taking up 50% of chart');
});

test('Should render keys', () => {
	const { getByTestId } = render(<CircleChart data={data} mainText="main text" />);
	expect(getByTestId('key-1')).toBeInTheDocument();
	expect(getByTestId('key-2')).toBeInTheDocument();
});

test('Should render the right colour for the keys', () => {
	const { getByTestId } = render(<CircleChart data={data} mainText="main text" />);
	expect(getByTestId('key-1-circle')).toHaveStyle('background-color: blue');
	expect(getByTestId('key-2-circle')).toHaveStyle('background-color: red');
});
