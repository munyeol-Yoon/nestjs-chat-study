import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

/**
 * Gateway lifecycle
 * 1. OnGatewayInit
 * OnGatewayInit 은 afterInit 메소드를 반드시 구현해야 되는 implement 이다.
 * 초기화가 되고 바로 실행되는 함수라고 생각하면 된다.
 * constructor 다음으로 afterInit 이 실행된다.
 *
 * 2. OnGatewayConnection
 * OnGatewayConnection 은 handleConnection 을 강제로 구현해야 하는 인터페이스이다.
 * 소켓이 처음에 연결이 될 때 handleConnection 이 발동한다.
 *
 * 3. OnGatewayDisconnect
 * OnGatewayDisconnect 는 소켓의 연결이 끊길때 작동되는 함수다.
 *
 */

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

@WebSocketGateway({ namespace: 'chattings' }) // @WebSocketGateway({ namespace: 'namespace'})
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');

  constructor() {
    this.logger.log('constructor');
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`disconnected: ${socket.id} ${socket.nsp.name}`);
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`connected: ${socket.id} ${socket.nsp.name}`);
  }

  afterInit() {
    this.logger.log('init');
  }

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
 * 풀링 방식
 * 풀링 방식은 클라이언트가 서버에 주기적으로 요청을 보내 새로운 데이터나 업데이트를 확인하는 통신 방식이다.
 * 실시간 통신보다는 일정 간격으로 서버 상태를 체크하는데 주로 사용된다.
 *
 * 1) 주기적 요청
 * 클라이언트는 정해진 시간 간격으로 서버에 데이터 요청을 보낸다.
 * 2) 서버의 응답
 * 서버는 클라이언트의 요청을 받고, 새로운 데이터나 업데이트가 있으면 이를 클라이언트에게 응답으로 보낸다.
 * 3) 데이터 없음의 응답
 * 새로운 데이터나 업데이트가 없을 경우, 서버는 이를 클라이언트에게 알리거나 빈 응답을 보낼 수 있다.
 *
 * 장점
 * - 구현이 간단하고 거의 모든 웹 환경에서 지원되므로 호환성 문제가 적다.
 * 단점
 * - 새로운 데이터가 서버가 있어도 클라이언트가 다음 요청을 할 때까지 기다려야한다.
 * - 클라이언트가 지속적으로 서버에게 요청을 보내므로 서버에 부담이 될 수 있다.
 * - 실시간 데이터 업데이트가 필요한 경우 최적의 방법이 아니다.
 *
 * 풀링은 실시간 통신이 필요하지 않은 상황이나, 웹 소켓과 같은 실시간 통신 기술을 사용할 수 없는 환경에서 유용하다.
 * 반대로는 웹 소켓이나 롱 폴링이 더 적합할 수 있다.
 *
 */

/**
 * 유니캐스팅
 * 유니캐스팅은 네트워크에서 하나의 송신자가 하나의 수신자에게 데이터를 전송하는 방식
 * 코드에서 socket.emit('hello_user', '안녕 ' + username); 은 유니캐스팅의 예이다.
 * 서버는 특정 클라이언트(새 사용자)에게만 메시지를 보낸다. 다른 모든 클라이언트는 이 메시지를 받지 않는다.
 *
 * 유니캐스팅은 특정 사용자와의 개별 통신이 필요할 때 사용한다.
 * 브로드캐스팅과는 다르게 모든 사용자에게 메시지를 보내는 것이 아니라 특정 사용자에게만 메시지를 보내는 방식이다.
 */

/**
 * 네임스페이스 socket.io
 *
 * 네임스페이스는 공간이라는 의미를 가진다.
 *
 * socket.io 는 거의 모든 브라우저에서 소켓 프로그래밍이 가능하도록 도와주는 라이브러리
 * 폴링 방식이 전통적인 방식인데, 실시간 프로그래밍을 할 수 있는 폴링방식 이외에도 스트리밍 방식 등 실시간 데이터 흐름을 처리할 수 있는 여러 방식들이 있다.
 * websocket 도 그 방법중 하나인데 이 경우 옛 브라우저에는 지원을 하지 않는 경우도 있다.
 * 그래서 websocket 을 지원을 하지 않는 브라우저에서는 풀링방식으로 socket.io 가 자동으로 처리 해준다.
 *
 * socket.io 는 폴링으로 브라우저한테 전송을 해보고 괜찮다고 생각이 들면 websocket 으로 소통을 하게 되는 것이다.
 *
 */
