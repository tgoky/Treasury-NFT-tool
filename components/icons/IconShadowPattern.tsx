import	React, {ReactElement}		from	'react';

function	IconShadowPattern(props: React.SVGProps<SVGSVGElement>): ReactElement {
	return (
		<svg {...props} width={'8'} height={'8'} viewBox={'0 0 8 8'} fill={'none'} xmlns={'http://www.w3.org/2000/svg'}>
			<path d={'M2 1C1.44772 1 1 1.44772 1 2C1 2.55228 1.44772 3 2 3C2.55228 3 3 2.55228 3 2C3 1.44772 2.55228 1 2 1Z'} fill={'black'}/>
			<path d={'M2 5C1.44772 5 1 5.44772 1 6C1 6.55228 1.44772 7 2 7C2.55228 7 3 6.55228 3 6C3 5.44772 2.55228 5 2 5Z'} fill={'black'}/>
			<path d={'M5 2C5 1.44772 5.44772 1 6 1C6.55228 1 7 1.44772 7 2C7 2.55228 6.55228 3 6 3C5.44772 3 5 2.55228 5 2Z'} fill={'black'}/>
			<path d={'M6 5C5.44772 5 5 5.44772 5 6C5 6.55228 5.44772 7 6 7C6.55228 7 7 6.55228 7 6C7 5.44772 6.55228 5 6 5Z'} fill={'black'}/>
		</svg>
	);
}

export default IconShadowPattern;
