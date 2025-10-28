import logging
import time
from django.utils.deprecation import MiddlewareMixin

logging.basicConfig(
    level=logging.DEBUG,
    format='%(levelname)s %(asctime)s %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

logger = logging.getLogger('django.request')


class RequestLoggingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.start_time = time.time()
        logger.info(f"Начало обработки запроса: {request.method} {request.path}")

        logger.debug(f"Заголовки запроса: {dict(request.headers)}")
        if request.GET:
            logger.debug(f"GET параметры: {dict(request.GET)}")
        if request.POST:
            logger.debug(f"POST данные: {dict(request.POST)}")

    def process_response(self, request, response):
        if hasattr(request, 'start_time'):
            duration = time.time() - request.start_time
            log_message = (
                f"Завершение обработки запроса: {request.method} {request.path} "
                f"Status: {response.status_code} Duration: {duration:.2f}s"
            )

            if response.status_code >= 500:
                logger.error(log_message)
            elif response.status_code >= 400:
                logger.warning(log_message)
            else:
                logger.info(log_message)

            logger.debug(f"Тип ответа: {response.headers.get('Content-Type', 'Unknown')}")

        return response

    def process_exception(self, request, exception):
        logger.error(
            f"Исключение при обработке запроса: {request.method} {request.path} - {str(exception)}",
            exc_info=True
        )