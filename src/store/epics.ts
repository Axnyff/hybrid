import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';
import { Action } from 'redux';
import { KeyboardDownAction } from 'store/keyboard';
import { filter, mapTo } from 'rxjs/operators';
import {interval} from 'rxjs';

const updateEpic = (action$: Observable<Action>) =>
  interval(1000 / 60).pipe(
    mapTo({ type: 'yolo' })
  );

export default combineEpics(
  updateEpic,
);
