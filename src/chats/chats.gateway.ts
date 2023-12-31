import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

/**
 * WebSocketGateway()
 * 클래스를 WebSocket 게이트웨이로 지정, 이 클래스는 클라이언트의 웹소켓 요청을 처리
 * SubscribeMessage('new_user')
 * 클라이언트에서 new_user 이벤트를 받기 위한 데코레이터, 클라이언트가 new_user 이벤트를 보내면 이 메서드가 호출
 * handleNewUser()
 * new_user 이벤트가 발생했을때 실행되는 메서드
 * MessageBody()
 * 클라이언트로 부터 전송된 메시지의 본문을 메서드의 매개변수로 바인딩하는데 사용.
 * 클라이언트가 서버로 메시지를 보낼 때 @MessageBody() 데코레이터가 붙은 매개변수는 해당 메시지의 데이터를 받는다.
 * ConnectedSocket()
 * 현재 메시지를 보낸 클라이언트의 소켓 객체를 메서드의 매개변수로 바인딩하는데 사용.
 * 서버는 클라이언트의 소켓에 접근해 해당 클라이언트에게 메시지를 보내거나 클라이언트의 소켓 정보를 사용할 수 있다.
 *
 */

@WebSocketGateway()
export class ChatsGateway {
  @SubscribeMessage('new_user') // socket 이벤트 받기
  handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(username);
    // console.log(socket);
    console.log(socket.id); // id 는 연결이 끊기기 전까지 유지

    socket.emit('hello_user', '안녕 ' + username);

    return '안녕 세상아';
  }
}

/**
 * 유니캐스팅
 * 유니캐스팅은 네트워크에서 하나의 송신자가 하나의 수신자에게 데이터를 전송하는 방식
 * 코드에서 socket.emit('hello_user', '안녕 ' + username); 은 유니캐스팅의 예이다.
 * 서버는 특정 클라이언트(새 사용자)에게만 메시지를 보낸다. 다른 모든 클라이언트는 이 메시지를 받지 않는다.
 *
 * 유니캐스팅은 특정 사용자와의 개별 통신이 필요할 때 사용한다.
 * 브로드캐스팅과는 다르게 모든 사용자에게 메시지를 보내는 것이 아니라 특정 사용자에게만 메시지를 보내는 방식이다.
 */
