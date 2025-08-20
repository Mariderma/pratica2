from google.cloud import recaptchaenterprise_v1
from google.cloud.recaptchaenterprise_v1 import Assessment

def create_assessment(
    project_id: str, recaptcha_key: str, token: str, recaptcha_action: str
) -> Assessment:
    """Crea una evaluación para analizar el riesgo de una acción de la IU.
    Args:
        project_id: 	abiding-kingdom-469601-p9
        recaptcha_key: 6LeG06srAAAAAGMSCanfKbNfnqW1tNry5HkzVGJ7
        token: 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
        recaptcha_action: LOGIN
    """

    client = recaptchaenterprise_v1.RecaptchaEnterpriseServiceClient()

    # Establece las propiedades del evento para realizar un seguimiento.
    event = recaptchaenterprise_v1.Event()
    event.site_key = recaptcha_key
    event.token = token

    assessment = recaptchaenterprise_v1.Assessment()
    assessment.event = event

    project_name = f"projects/{project_id}"

    # Crea la solicitud de evaluación.
    request = recaptchaenterprise_v1.CreateAssessmentRequest()
    request.assessment = assessment
    request.parent = project_name

    response = client.create_assessment(request)

    # Verifica si el token es válido.
    if not response.token_properties.valid:
        print(
            "The CreateAssessment call failed because the token was "
            + "invalid for the following reasons: "
            + str(response.token_properties.invalid_reason)
        )
        return

    # Verifica si se ejecutó la acción esperada.
    if response.token_properties.action != recaptcha_action:
        print(
            "The action attribute in your reCAPTCHA tag does"
            + "not match the action you are expecting to score"
        )
        return
    else:
        # Obtén la puntuación de riesgo y los motivos.
        # Para obtener más información sobre cómo interpretar la evaluación, consulta:
        # https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment
        for reason in response.risk_analysis.reasons:
            print(reason)
        print(
            "The reCAPTCHA score for this token is: "
            + str(response.risk_analysis.score)
        )
        # Obtén el nombre de la evaluación (ID). Úsalo para anotar la evaluación.
        assessment_name = client.parse_assessment_path(response.name).get("assessment")
        print(f"Assessment name: {assessment_name}")
    return response