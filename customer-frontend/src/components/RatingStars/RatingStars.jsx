import {
Star
} from 'lucide-react';
 import './RatingStars.css';
 export default function RatingStars({
value=0,onChange,readOnly=false
}){
return <div className="rating-stars" aria-label={
`${
value
} out of 5 stars`
}>{
[1,2,3,4,5].map(n=>
<button type="button" disabled={
readOnly
} onClick={
()=>onChange?.(n)
} key={
n
} aria-label={
`${
n
} stars`
}>
<Star fill={
n<=value?'currentColor':'none'
}/>
</button>)
}</div>
}
